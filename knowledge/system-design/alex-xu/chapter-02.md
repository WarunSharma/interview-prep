# Chapter 2: Back-of-the-Envelope Estimation

Goal: quickly estimate system capacity/performance using rough math and known performance numbers — interviewers care more about your **process** than exact results.

*(No highlights found on the chapter's pages in your PDF.)*

## 1. What It Is
- A **back-of-the-envelope estimation** uses thought experiments + common performance numbers to judge whether a design will meet requirements (quote from Jeff Dean, Google Senior Fellow).
- Requires understanding: **power of two**, **latency numbers**, and **availability numbers**.

## 2. Power of Two
- All data volume calculations reduce to units based on powers of 2.
- 1 byte = 8 bits; an ASCII character = 1 byte.
- Know the standard data volume unit table (KB, MB, GB, TB, PB, etc.) to convert quickly during calculations.

**Table 2-1: Data volume units**

| Power | Approximate value | Full name | Short name |
|-------|-------------------|-----------|------------|
| 10 | 1 Thousand | 1 Kilobyte | 1 KB |
| 20 | 1 Million | 1 Megabyte | 1 MB |
| 30 | 1 Billion | 1 Gigabyte | 1 GB |
| 40 | 1 Trillion | 1 Terabyte | 1 TB |
| 50 | 1 Quadrillion | 1 Petabyte | 1 PB |

## 3. Latency Numbers Every Programmer Should Know
- Based on Jeff Dean's well-known figures on typical computer operation times (some now outdated, but still useful for relative comparison).
- Units: ns (nanosecond) < µs (microsecond) < ms (millisecond); 1 µs = 1,000 ns, 1 ms = 1,000 µs.
- Key takeaways from the numbers:
  - **Memory is fast; disk is slow.**
  - **Avoid disk seeks** where possible.
  - **Simple compression algorithms are fast** — compress data before sending over the network when possible.
  - **Cross-region data transfer takes real time** (data centers in different regions add latency).

**Table 2-2: Latency numbers every programmer should know**

| Operation name | Time |
|---|---|
| L1 cache reference | 0.5 ns |
| Branch mispredict | 5 ns |
| L2 cache reference | 7 ns |
| Mutex lock/unlock | 100 ns |
| Main memory reference | 100 ns |
| Compress 1K bytes with Zippy | 10,000 ns = 10 µs |
| Send 2K bytes over 1 Gbps network | 20,000 ns = 20 µs |
| Read 1 MB sequentially from memory | 250,000 ns = 250 µs |
| Round trip within the same datacenter | 500,000 ns = 500 µs |
| Disk seek | 10,000,000 ns = 10 ms |
| Read 1 MB sequentially from the network | 10,000,000 ns = 10 ms |
| Read 1 MB sequentially from disk | 30,000,000 ns = 30 ms |
| Send packet CA → Netherlands → CA | 150,000,000 ns = 150 ms |

*Notes: ns = nanosecond, µs = microsecond, ms = millisecond. 1 ns = 10⁻⁹ s; 1 µs = 10⁻⁶ s = 1,000 ns; 1 ms = 10⁻³ s = 1,000 µs = 1,000,000 ns.*

## 4. Availability Numbers
- **High availability**: system stays operational continuously; measured as a percentage of uptime (100% = zero downtime). Most real services sit between 99% and 100%.
- **SLA (Service Level Agreement)**: a formal agreement between provider and customer defining guaranteed uptime. Major cloud providers (AWS, Google Cloud, Azure) commit to **99.9%+**.
- Uptime is expressed in **"nines"** — the more nines, the less downtime (e.g., 99.9% vs 99.99% vs 99.999%), each additional nine drastically reduces allowed downtime.

**Table 2-3: Availability (nines) vs downtime**

| Availability % | Downtime per day | Downtime per year |
|---|---|---|
| 99% | 14.40 minutes | 3.65 days |
| 99.9% | 1.44 minutes | 8.77 hours |
| 99.99% | 8.64 seconds | 52.60 minutes |
| 99.999% | 864.00 milliseconds | 5.26 minutes |
| 99.9999% | 86.40 milliseconds | 31.56 seconds |

## 5. Worked Example: Estimating Twitter QPS & Storage
**Assumptions:**
- 300 million monthly active users (MAU)
- 50% of users are active daily
- Each user posts 2 tweets/day on average
- 10% of tweets contain media
- Data retained for 5 years

**QPS (Queries Per Second) estimate:**
- Daily Active Users (DAU) = 300M × 50% = **150 million**
- Tweet QPS = (150M × 2 tweets) / 24h / 3600s ≈ **~3,500 QPS**
- Peak QPS = 2 × average QPS ≈ **~7,000 QPS**

**Media storage estimate:**
- Avg sizes: tweet_id = 64 bytes, text = 140 bytes, media = 1 MB
- Daily media storage = 150M × 2 × 10% × 1MB = **30 TB/day**
- 5-year media storage = 30 TB × 365 × 5 ≈ **~55 PB**

## 6. Interview Tips
- **Round and approximate** — don't waste time on precise arithmetic (e.g., simplify `99987 / 9.1` to `100,000 / 10`). Precision isn't the point.
- **Write down your assumptions** so you (and the interviewer) can refer back to them.
- **Label your units clearly** (e.g., "5 MB" not just "5") to avoid ambiguity.
- **Practice common estimation types**: QPS, peak QPS, storage, cache size, number of servers needed, etc.
- Remember: the **process/reasoning** matters more than getting the "right" final number — interviewers are testing problem-solving skill.