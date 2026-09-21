# Chapter 4: Design a Rate Limiter

**Simple idea:** A rate limiter is like a bouncer at a club door — it controls how many requests a user/client can send in a given time. If someone sends too many requests too fast, the extra ones get blocked.

*(No highlights found on this chapter's pages in your PDF.)*

Examples of rate limits:
- Max 2 posts per second per user
- Max 10 new accounts per day from the same IP
- Max 5 reward claims per week per device

## 1. Why Use a Rate Limiter?
- **Stops abuse/attacks (DoS)** — blocks someone from flooding your servers with requests (e.g., Twitter allows only 300 tweets per 3 hours).
- **Saves money** — fewer wasted server resources; especially important if you pay per API call to a third party (e.g., payment or health-record APIs).
- **Prevents server overload** — filters out excess traffic caused by bots or misbehaving clients, keeping the system responsive for everyone else.

## 2. Step 1: Clarify the Requirements
Before designing anything, ask questions like:
- Is this a client-side or server-side rate limiter? → *Usually server-side.*
- Should it limit by IP, by user ID, or something else? → *Should be flexible enough for different rules.*
- Does it need to work across multiple servers (distributed)? → *Yes.*
- Should users be told when they're throttled? → *Yes.*

**Final requirements:**
- Accurately limit excess requests
- Low latency (shouldn't slow down normal traffic)
- Use minimal memory
- Works across multiple servers/processes (distributed)
- Gives clear error messages when throttled
- Fault-tolerant — if the rate limiter itself breaks, it shouldn't break the whole system

## 3. Step 2: High-Level Design

### Where should the rate limiter live?
- **Client-side** — not reliable, since a malicious user can easily fake or bypass client code.
- **Server-side** — the safer, standard approach.
- **Middleware** (a separate layer sitting in front of your API servers) — often the best choice. It checks each incoming request and rejects the extra ones with an **HTTP 429 "Too Many Requests"** response.
- In real systems, this logic often lives inside an **API Gateway** — a managed component that also handles things like authentication, SSL, and IP whitelisting.
- Whether to build your own or use a ready-made gateway depends on your team's tech stack, time, and resources.

### Algorithms for Rate Limiting (the "how")
Five common algorithms, in simple terms:

1. **Token Bucket** (most popular — used by Amazon, Stripe)
   - Imagine a bucket that holds tokens. Tokens are added at a steady rate (e.g., 2 per second) up to a max capacity.
   - Every request needs 1 token to go through. No tokens left → request is dropped.
   - ✅ Simple, memory-efficient, allows short traffic bursts.
   - ❌ Hard to perfectly tune the two settings (bucket size + refill rate).

2. **Leaking Bucket**
   - Like a bucket with a small hole in the bottom (a queue) — requests come in and are processed at a fixed, steady rate, regardless of how fast they arrive.
   - If the "bucket" (queue) is full, new requests are dropped.
   - ✅ Memory-efficient, gives a stable, predictable output rate.
   - ❌ A sudden burst fills the queue with old requests, so more recent ones may get unfairly delayed/dropped.

3. **Fixed Window Counter**
   - Time is split into fixed chunks (e.g., every 1 second). Each chunk has a counter; once it hits the limit, extra requests are dropped until the next chunk starts.
   - ✅ Simple, memory-efficient.
   - ❌ **Boundary problem**: a burst right at the edge of two windows can let through nearly double the allowed requests (e.g., 5 allowed/minute but 10 sneak through across a window boundary).

4. **Sliding Window Log**
   - Fixes the boundary problem by keeping an exact **timestamp log** of every request (usually in Redis). Old timestamps (outside the current time window) are removed, then it checks whether the log size is still within the limit.
   - ✅ Very accurate — never exceeds the true limit.
   - ❌ Uses a lot of memory since it stores every request's timestamp, even rejected ones.

5. **Sliding Window Counter**
   - A hybrid: blends the current window's count with a weighted portion of the previous window's count (based on how much they overlap).
   - ✅ Smooths out bursts, memory-efficient — good middle ground.
   - ❌ It's an approximation, not 100% exact (though in practice, Cloudflare found only ~0.003% of requests were miscounted).

### High-Level Architecture
- Use an **in-memory cache like Redis** to store counters (not a database — too slow).
- Redis provides two handy commands: `INCR` (increase counter by 1) and `EXPIRE` (auto-delete counter after a set time).
- Flow: Client → Rate Limiter Middleware → checks counter in Redis → if under limit, forward to API server and increment counter; if over limit, reject the request.

## 4. Step 3: Deep Dive Details

### Where do the rate-limiting rules come from?
- Rules are usually written in **config files** (example from Lyft's open-source rate limiter):
  - "Max 5 marketing messages per day"
  - "Max 5 login attempts per minute"

### What happens when a request is rate-limited?
- The server returns **HTTP 429 (Too Many Requests)**.
- Depending on the use case, the blocked request might be **dropped** or **queued** to retry later (e.g., an order that's rate-limited due to overload could just be processed a bit later instead of failing outright).

### How does the client know it's being throttled?
Via special HTTP response headers:
- `X-Ratelimit-Remaining` — how many requests you have left in this window
- `X-Ratelimit-Limit` — total allowed calls per window
- `X-Ratelimit-Retry-After` — how many seconds to wait before trying again

### Detailed Flow
1. Rules are stored on disk; background workers load them into cache periodically.
2. Client request → hits rate limiter middleware.
3. Middleware checks the rules (from cache) + current counter (from Redis).
4. Not over limit → forward to API server. Over limit → return 429 (and optionally queue/drop the request).

## 5. Making It Work Across Multiple Servers (Distributed Systems)

Two tricky problems appear once you have **more than one** rate limiter server:

### Problem 1: Race Condition
- If two requests read the same counter value (say, 3) **at the same time** before either writes back, both might increment it to 4 — but the real answer should be 5. This causes incorrect (too generous) rate limiting.
- **Fix**: avoid slow locks; instead use **Lua scripts** (atomic scripts run inside Redis) or Redis's **sorted sets** data structure to safely handle concurrent updates.

### Problem 2: Synchronization Across Servers
- If Client 1 talks to Rate Limiter Server 1 and Client 2 talks to Rate Limiter Server 2, but then Client 2 gets routed to Server 1 later — Server 1 has no memory of Client 2's previous requests, and rate limiting breaks.
- **Bad fix**: "sticky sessions" (always route a client to the same server) — not scalable or flexible.
- **Good fix**: use a **shared, centralized data store** (like Redis) that *all* rate limiter servers read/write to, so they all see the same counters.

## 6. Performance & Monitoring

- **Multi-data-center setup**: Place rate limiters closer to users (edge servers) around the world to reduce latency — similar to how CDNs work.
- **Eventual consistency**: When syncing data between multiple data centers, perfect real-time consistency isn't required — "eventually consistent" is good enough (explained more in Chapter 6).
- **Monitoring after launch**: Check whether your rate limiting rules and algorithm are actually working well.
  - Rules too strict → valid users get blocked → loosen them.
  - Sudden traffic spikes (e.g., flash sales) breaking the limiter → consider switching to **Token Bucket**, since it handles bursts well.

## 7. Extra Talking Points (Bonus, If You Have Time)

- **Hard vs. Soft rate limiting**:
  - *Hard limit*: requests can NEVER exceed the threshold.
  - *Soft limit*: requests can briefly exceed the threshold for a short grace period.
- **Rate limiting at different network layers**:
  - This chapter covers **Layer 7** (Application layer — HTTP-based limiting).
  - You could also rate limit at **Layer 3** (Network layer) using tools like Iptables, based on IP address.
  - *(Quick OSI model reminder: Layer 1 Physical → 2 Data link → 3 Network → 4 Transport → 5 Session → 6 Presentation → 7 Application)*
- **How clients can avoid getting rate-limited**:
  - Cache responses on the client side to avoid repeat calls.
  - Know your limits and don't send bursts of requests.
  - Handle errors gracefully (catch exceptions from 429 responses).
  - Use "backoff" logic — wait progressively longer before retrying after a failure.

## Summary
- A rate limiter blocks excess requests to protect servers, save cost, and prevent abuse.
- Best implemented **server-side**, often as **middleware** or inside an **API gateway**.
- Five key algorithms: **Token Bucket**, **Leaking Bucket**, **Fixed Window Counter**, **Sliding Window Log**, **Sliding Window Counter** — each with different memory/accuracy/burst-handling tradeoffs.
- Use **Redis** (fast, in-memory, supports auto-expiry) to track counters.
- In distributed setups, watch out for **race conditions** (fix with Lua scripts/sorted sets) and **synchronization** (fix with a centralized store).
- Don't forget: proper HTTP headers/error codes, monitoring, and multi-region performance optimization.
