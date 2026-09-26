# Distributed Rate Limiter

Source: [Hello Interview breakdown](https://www.hellointerview.com/learn/system-design/problem-breakdowns/distributed-rate-limiter)

## Scope and requirements

- Limit HTTP requests by user ID, API key, IP address, endpoint, and/or a global budget.
- Return `429 Too Many Requests` when a rule is exceeded, with `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, and optionally `Retry-After`.
- Rate-limit **requests**, not higher-level business actions. Long-term usage analytics and durable rate-limit history are out of scope.
- Target: ~1M RPS across ~100M DAU, <10 ms added latency, high availability; eventual consistency is usually acceptable.
- Fail fast for interactive APIs; queuing rejected requests adds memory, latency, and retry amplification.

### Key entities and interface

- **Rule:** matching scope (client type, endpoint, tier) plus limit parameters.
- **Client:** user, API key, IP, or a composite identity.
- **Request:** identity, endpoint, and timestamp used to select and evaluate rules.

```text
isRequestAllowed(clientId, ruleId)
  -> { passes: boolean, remaining: number, resetTime: timestamp }
```

## Placement

| Placement | Benefit | Drawback |
| --- | --- | --- |
| In-process | Fast, no network call | Per-node state makes global limits inaccurate |
| Dedicated service | Centralized, rich application context | Extra hop and another critical service |
| API gateway | Blocks traffic before backends; centralized enforcement | Only sees request-level context |

**In-process limitation:** with five application instances, a nominal 100 req/min user limit can effectively become up to 500 req/min because each instance sees only part of the traffic.

**Default choice:** enforce at the API gateway using request data. This protects downstream services because rejected traffic never reaches them. Use authenticated user/API-key limits where possible; IP limits are useful for anonymous traffic but can penalize users behind NATs.

### Rule matching

- Extract a user ID from a verified auth token, an API key from a request header, or client IP from trusted proxy metadata such as `X-Forwarded-For`.
- Apply layered rules: per-user, per-IP, per-API-key, per-endpoint, and global. Reject if **any** applicable rule denies the request.
- Example: a user may have 1,000 req/hour remaining but still be blocked because their IP has exhausted its 100 req/min shared-IP budget.
- Gateway-only policies need context encoded in the request/token; rules based on database-only attributes add a costly dependency.

## Algorithms

| Algorithm | Strength | Trade-off |
| --- | --- | --- |
| Fixed window | Simplest, cheap | Boundary burst: up to 2x limit around a window change |
| Sliding-window log | Exact rolling-window limit | Stores every timestamp; high memory/work |
| Sliding-window counter | Accurate approximation; two counters | Assumes requests are evenly distributed |
| Token bucket | Smooth sustained rate plus allowed bursts | Tune bucket capacity and refill rate |

### Algorithm details

- **Fixed window:** maintain a counter per client/window. Easy and compact, but 100 requests at `12:00:59` plus 100 at `12:01:00` permits a 200-request burst in two seconds.
- **Sliding-window log:** remove timestamps older than the rolling window and count the remainder. Exact, but a client at 1,000 req/min requires 1,000 stored timestamps.
- **Sliding-window counter:** weight the previous bucket by its unused fraction. At 30% through the current minute, estimate `current + 70% * previous`; memory-efficient but approximate.
- **Token bucket:** capacity controls maximum burst; refill rate controls long-term throughput. An idle client starts/refills to capacity and can burst, then is throttled to the configured rate.

**Recommended default: token bucket.** Per `(client, rule)`, store `tokens` and `lastRefill`. On each request:

1. Refill `min(capacity, tokens + elapsed * refillRate)`.
2. Allow and consume one token if at least one remains; otherwise reject.
3. Set a TTL so inactive buckets are removed.

## Core design

```text
Client -> API Gateway -> application services
             |
             +-> Redis Cluster (atomic token-bucket state)
             |
             +-> config service / database (cached rules; watch/push for urgent changes)
```

- Derive a key such as `rate:{ruleId}:{clientId}` and ensure all requests for it reach the same Redis shard.
- Redis holds shared, short-lived bucket state: `tokens`, `last_refill`, and a TTL. It is a source of truth shared by all gateways, not long-term storage.
- Run the full read-refill-decrement-write operation atomically (e.g., Redis Lua script). `HMGET` followed by `MULTI/EXEC` is still unsafe if the read occurs outside the transaction.
- The atomic script reads state, calculates elapsed refill, caps the bucket, consumes a token if possible, writes the new state, sets expiry, and returns allow/remaining/reset metadata.
- Apply **all** matching rules (per-user, per-IP, per-endpoint, global) and reject if any rule denies.

### Why atomicity matters

If one token remains and two gateways independently read that value, both can decide to allow. Individual `HSET` operations or a transaction containing only writes do not prevent this lost-update race. The atomic boundary must cover the complete read-modify-write decision.

## Scaling and reliability

- A single Redis node cannot support 1M atomic checks/sec; token checks incur at least a read/update workflow. Shard by a stable client identifier so one client's state is never split across nodes.
- Consistent hashing maps `userId`, IP, or API key consistently to a shard. In practice, Redis Cluster distributes keys over hash slots and routes requests for the gateway.
- Give each shard replicas and automatic failover. Monitor Redis latency, CPU, memory, shard health, reject rates, and limiter error rates.
- Choose failure behavior deliberately:
  - **Fail closed:** reject when the limiter datastore is unavailable; protects overloaded/security-sensitive systems but reduces availability.
  - **Fail open:** preserve API availability but risk overload/abuse; only safe with adequate downstream protection.
- For a social platform during a traffic spike, prefer **fail closed**: losing some requests is better than sending unbounded traffic to databases and causing a cascade. Financial or security-sensitive workflows often make the same choice.
- Keep gateways and Redis regional; connection-pool persistent Redis connections rather than performing a TCP handshake per check. Deploying a user in Tokyo against Redis in Virginia wastes the latency budget.
- Local caching, pipelining, and batching can reduce calls but trade accuracy/complexity. Do not use stale local state unless approximate enforcement is explicitly acceptable.

## Hot keys and operations

- A single abusive or high-volume client can create a **hot key**, concentrating tens of thousands of checks/sec on one shard.
- For abuse: use upstream DDoS protection, and temporarily block IPs/API keys that repeatedly exceed limits. Block as early as possible, before the limiter becomes the bottleneck.
- For legitimate high-volume clients: support batching, promote client-side smoothing, offer higher/premium limits, or provision dedicated capacity.
- Client-side limiting is an optimization, never a security control.
- IP-based limits should be set conservatively because corporate NATs and public Wi-Fi can make unrelated users share an IP.

## Dynamic rule configuration

- Store policies such as `{clientType, endpoint, capacity, refillRate}` in a database or configuration service; gateways cache the active rules.
- **Polling:** refresh every e.g. 30 seconds. Simple and sufficient for normal operations, but emergency changes are delayed.
- **Push/watch:** ZooKeeper, etcd, Redis pub/sub, or a dedicated config service broadcasts changes quickly. Better for attacks/emergencies, but must tolerate disconnected gateways and partial propagation.
- Roll out sensitive changes gradually and monitor rejection and backend-load impact.

## Observability

- Track allowed/rejected/error decisions by rule, client type, endpoint, and region.
- Alert on Redis latency/errors, memory/CPU pressure, replication/failover events, sudden `429` changes, and any fail-open activation.
- Expose response headers consistently so clients can back off instead of retrying blindly.

## Interview checklist

1. Clarify identity, limits, traffic scale, burst tolerance, and fail-open/closed policy.
2. Place the limiter at the gateway; describe layered rules.
3. Compare algorithms and select token bucket.
4. Explain atomic Redis updates and why separate read/write commands race.
5. Explain Redis Cluster sharding, replicas/failover, regional placement, and connection pooling.
6. Cover `429` headers, observability, hot keys, and dynamic policy rollout.

## Expected depth

- **Mid-level:** choose a gateway, shared Redis state, and one algorithm (usually token bucket).
- **Senior:** justify algorithm and placement trade-offs; cover atomicity, sharding, hot keys, latency, and failure mode.
- **Staff+:** add multi-region consistency trade-offs, operational runbooks/alerts, canary policy rollouts, and incident behavior.
