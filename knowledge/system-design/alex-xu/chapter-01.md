# Chapter 1: Scale From Zero to Millions of Users

Goal: start with a single-server setup and evolve it step-by-step into an architecture that can serve millions of users.

## 1. Single Server Setup
- Everything (web app, database, cache) runs on **one server**.
- Request flow: User → DNS (returns IP) → HTTP request to web server → server returns HTML/JSON.
- Traffic sources: **web apps** (server-side + client-side code) and **mobile apps** (talk to server via HTTP, usually using **JSON** responses).

## 2. Database (Separating Web and Data Tiers)
- As users grow, split into a **web tier** (handles traffic) and a **data tier** (database) — allows independent scaling.
- **Relational (SQL/RDBMS)**: MySQL, PostgreSQL, Oracle — data in tables/rows, supports joins.
- **Non-relational (NoSQL)**: DynamoDB, Cassandra, Neo4j, HBase — key-value, document, column, graph stores; usually no joins.
- Prefer NoSQL when: need super-low latency, unstructured data, only need serialize/deserialize, or need to store massive data volumes.

## 3. Vertical vs Horizontal Scaling
- **Vertical scaling (scale up)**: add more CPU/RAM to one server. Simple, but hits hardware limits and has **no failover/redundancy**.
- **Horizontal scaling (scale out)**: add more servers. Preferred for large-scale systems.
- Problem it solves: a single web server is a single point of failure and has a traffic ceiling → solved by a **load balancer**.

## 4. Load Balancer
- Evenly distributes incoming traffic across multiple web servers.
- Users hit the load balancer's **public IP**; it talks to web servers over **private IPs** (more secure).
- Benefits:
  - If one server fails, traffic reroutes to healthy servers (no downtime).
  - Handles traffic growth by simply adding more servers to the pool.
- After this: web tier has failover; the data tier still needs the same treatment → **database replication**.

## 5. Database Replication
- Typically a **master-slave** setup:
  - **Master**: handles writes/updates/deletes.
  - **Slaves**: handle reads (copies of master's data). Usually more slaves than masters since reads >> writes.
- **Advantages**:
  - Better performance (reads/writes parallelized).
  - Reliability (data survives if one server is destroyed).
  - High availability (site stays up even if one DB goes offline).
- Failure handling:
  - If a slave goes down → reads redirect to another slave or temporarily to master; a replacement slave is created.
  - If the master goes down → a slave is promoted to master (production promotion is complex — needs data recovery for missing updates).

## 6. Cache
- A temporary, fast, in-memory data store for expensive or frequently accessed responses — reduces repeated DB calls.
- **Read-through cache** pattern: check cache → if hit, return; if miss, query DB, store result in cache, then return.
- **Key considerations**:
  - **When to use**: data read often, written rarely (cache is volatile — data lost on restart, so don't use as sole persistence).
  - **Expiration policy**: not too short (causes DB reload thrashing) or too long (stale data).
  - **Consistency**: keep cache and DB in sync (hard at multi-region scale — see "Scaling Memcache at Facebook").
  - **Mitigating failures**: a single cache server is a **SPOF** → use multiple cache servers across data centers; overprovision memory.
  - **Eviction policy**: when cache is full, remove items. **LRU** (Least Recently Used) is most common; also LFU, FIFO.

## 7. Content Delivery Network (CDN)
- A network of geographically distributed servers that cache **static content** (images, video, CSS, JS).
- Users are served by the **nearest** CDN server → faster load times.
- **CDN workflow**: client requests asset → if not cached, CDN pulls it from origin (web server/S3) → origin returns it with a **TTL** → CDN caches and serves it → subsequent requests served from cache until TTL expires.
- **Considerations**:
  - **Cost**: pay for data transfer; don't cache rarely used assets.
  - **Cache expiry**: balance freshness vs. reload frequency.
  - **CDN fallback**: handle CDN outages by falling back to origin.
  - **Invalidation**: use CDN vendor APIs or **object versioning** (e.g., `image.png?v=2`).

## 8. Stateless Web Tier
- **Stateful servers**: remember client session data → requests from a given user must always route to the same server (needs "sticky sessions"), making scaling/failure-handling harder.
- **Stateless servers**: no session data stored locally; session/state data is moved to a **shared persistent store** (SQL, NoSQL, Redis/Memcached).
- Benefit: any server can handle any request → enables easy **auto-scaling** (adding/removing servers based on load).

## 9. Data Centers (Multi-Region Setup)
- Users are routed to the nearest data center via **geoDNS/geo-routing** (e.g., split traffic between US-East/US-West).
- If one data center goes down, all traffic is redirected to the healthy one.
- Key challenges:
  - **Traffic redirection** (GeoDNS to nearest healthy DC).
  - **Data synchronization** across regions (replicate data across data centers, e.g., Netflix's async multi-DC replication).
  - **Testing & deployment** consistency across all locations via automated tools.

## 10. Message Queue
- A durable, in-memory component enabling **asynchronous communication** between services.
- **Producers/publishers** push messages → **Consumers/subscribers** pull and process them.
- Decouples system components: producer and consumer can be scaled and fail independently.
- Example: photo processing — web servers publish jobs → worker pool consumes jobs asynchronously; scale workers up/down based on queue size.

## 11. Logging, Metrics, Automation
- **Logging**: monitor error logs (per-server or centralized/aggregated) to catch issues.
- **Metrics**: track system health and business performance —
  - Host-level (CPU, memory, disk I/O)
  - Aggregated (DB tier, cache tier performance)
  - Business (DAU, retention, revenue)
- **Automation**: CI/CD pipelines, automated build/test/deploy to boost productivity and catch problems early.

## 12. Database Scaling
- **Vertical scaling**: bigger machine (more CPU/RAM/disk). Simple, but hardware limits, higher SPOF risk, and expensive.
- **Horizontal scaling (Sharding)**: split a large DB into smaller **shards**, each holding a subset of data with the same schema.
  - A **hash function** (e.g., `user_id % 4`) routes each query to the right shard.
  - **Sharding key (partition key)**: determines data distribution — must be chosen to distribute data **evenly**.
- **Challenges of sharding**:
  - **Resharding**: needed when a shard fills up or grows unevenly (shard exhaustion) — resolved via techniques like **consistent hashing** (covered in Ch. 5).
  - **Celebrity/hotspot problem**: uneven load if related high-traffic data lands on one shard — may need dedicated shards for "hot" keys.
  - **Joins & de-normalization**: cross-shard joins are hard — commonly solved by de-normalizing data so queries hit a single table.

## Summary — Techniques to Scale to Millions of Users
- Keep the web tier **stateless**
- Build **redundancy** at every tier
- **Cache** data as much as possible
- Support **multiple data centers**
- Host static assets on a **CDN**
- Scale the data tier via **sharding**
- Split the system into **individual (decoupled) services**
- **Monitor** the system and use **automation** tools