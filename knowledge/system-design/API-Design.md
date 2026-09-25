# API Design Notes

Source: [API Design for System Design Interviews](https://www.youtube.com/watch?v=DQ57zYedMdQ)

## Purpose of API Design in System Design

An API (Application Programming Interface) is a contract that lets software components communicate through defined rules and protocols. For example:

```text
Client -> Server -> Database
```

For a ticketing application, a client might request events from the server; the server retrieves them from the database and returns the result.

In a system-design interview, API design follows requirements and core-entity identification:

```text
Requirements -> Core entities -> API design -> Data flow -> High-level design -> Deep dives
```

The API section should be concise--roughly five minutes--rather than a deep implementation discussion.

## Selecting an API Style

| Situation | Preferred style | Why |
| --- | --- | --- |
| Typical client-to-server API | REST | Widely understood, HTTP-based, easy to debug, and usually the default |
| Clients need different subsets of connected data | GraphQL | Clients select exactly the fields they need in one request |
| Internal service-to-service communication | RPC / gRPC | Efficient, strongly typed, compact binary messages |
| Continuous real-time updates | WebSockets, SSE, or WebRTC | Maintains an open connection for streaming data |

REST is the default choice for most external APIs. Use GraphQL only when its flexible query model solves a clear client-data problem. Use RPC primarily when you control both ends of internal service communication.

---

## REST

REST models an API around **resources** and standard HTTP methods. Resources should map directly to the system's core entities, such as:

- `events`
- `venues`
- `tickets`
- `bookings`

### Resource Modeling

Use plural nouns in paths. The HTTP method expresses the action, so paths should not contain action verbs.

| Recommended | Avoid |
| --- | --- |
| `POST /events` | `POST /events/create` |
| `GET /events/{id}` | `GET /getEvent/{id}` |

Example ticketing endpoints:

```http
GET  /events
GET  /events/{id}
GET  /venues/{id}
GET  /events/{id}/tickets
POST /events/{id}/bookings
GET  /bookings/{id}
```

| Endpoint | Meaning |
| --- | --- |
| `GET /events` | List events |
| `GET /events/{id}` | Get one event |
| `GET /venues/{id}` | Get one venue |
| `GET /events/{id}/tickets` | List tickets available for an event |
| `POST /events/{id}/bookings` | Create a booking for an event |
| `GET /bookings/{id}` | Get one booking |

### HTTP Methods

| Method | Purpose | Idempotent? |
| --- | --- | --- |
| `GET` | Retrieve data | Yes |
| `POST` | Create data | Usually no |
| `PUT` | Fully replace or idempotently update a resource | Yes |
| `PATCH` | Partially update a resource | Usually treated as the choice for partial updates |
| `DELETE` | Remove data | Yes in intended final state |

**Idempotent** means repeating the same request produces the same final server state. For example, repeatedly replacing the data for the same event with `PUT` leaves the event in the same final state. Repeating a `POST /events` may create multiple events.

### Request Inputs

REST inputs generally appear in one of three places:

| Input type | Use it when | Example |
| --- | --- | --- |
| Path parameter | Required to identify the target resource | `GET /events/123` |
| Query parameter | Optional filtering, sorting, or pagination | `GET /events?city=LA&date=2025-01-01` |
| Request body | Creating or updating data | `POST /events` with JSON |

Rules of thumb:

- Required to identify a resource: use a **path parameter**.
- Optional refinement: use **query parameters**.
- Data to create or change: use the **request body**.

The first query parameter begins with `?`; additional parameters use `&`.

```http
GET /events?city=LA&date=2025-01-01
```

```json
{
  "title": "Summer Concert",
  "description": "An outdoor concert",
  "location": "Los Angeles",
  "date": "2025-01-01"
}
```

### Responses and Status Codes

An API response has two main parts:

1. A **status code**, which indicates the outcome.
2. A **response body**, usually JSON, containing the requested data or error details.

Useful status codes:

| Code | Meaning |
| --- | --- |
| `200 OK` | Successful request |
| `201 Created` | Resource created successfully |
| `400 Bad Request` | Invalid client request |
| `401 Unauthorized` | Authentication is missing or invalid |
| `404 Not Found` | Requested resource does not exist |
| `500 Internal Server Error` | Server-side failure |

In an interview, response categories are usually enough:

- `2xx`: success
- `4xx`: client error, such as invalid input or missing authorization
- `5xx`: server error

Avoid spending time enumerating every property of an entity in API responses. Use concise shapes such as:

```text
GET /events -> Event[]
GET /events/{id} -> Event
```

Define the full entity later during high-level design if needed.

---

## GraphQL

GraphQL was created at Facebook in 2012 and open-sourced in 2015. It lets clients explicitly request the fields they need.

### Why Use GraphQL?

With REST, clients needing different views of related data often force a trade-off:

1. Create many specialized endpoints, leading to endpoint sprawl.
2. Create broad endpoints that return too much data, increasing payload size and latency.

GraphQL avoids both by allowing a client to select only the required fields. It still runs over HTTP, commonly through a single endpoint such as:

```http
POST /graphql
```

The query is typically sent in the request body:

```graphql
query {
  event(id: "123") {
    name
    date
    venue {
      name
      address
    }
    tickets {
      section
      price
      available
    }
  }
}
```

This can replace multiple REST calls such as:

```http
GET /events/123
GET /events/123/tickets
GET /venues/{venueId}
```

### GraphQL Considerations

#### N+1 Query Problem

A GraphQL query for 100 events and each event's venue can accidentally cause:

1. One query to fetch the events.
2. One additional query per event to fetch its venue.

This becomes `N + 1` database queries. Prevent it with batching, commonly through a data-loader pattern:

- Collect the related IDs requested by resolvers.
- Fetch all related records in one batched query.
- Map the results back to the individual resolvers.

#### Field-Level Authorization

REST commonly secures an entire endpoint. GraphQL can authorize individual fields through schema resolvers. For example, a user may be allowed to read an event's `name` and `date` but not its revenue data.

---

## RPC and gRPC

Remote Procedure Call (RPC) is designed for efficient service-to-service communication. Instead of operating on URL resources, services expose callable methods:

```text
getEvent(eventId: "123")
createBooking(eventId: "123", userId: "456", tickets: [...])
getAvailableTickets(eventId: "123", section: "VIP")
```

This is conceptually like calling a local function over the network.

### Why RPC Is Useful Internally

Compared with typical REST APIs, RPC can reduce overhead from:

- Human-readable JSON serialization
- URL parsing
- Repetitive HTTP metadata

gRPC commonly uses Protocol Buffers (Protobuf), a compact binary and strongly typed interface definition language.

```proto
service TicketService {
  rpc GetEvent(GetEventRequest) returns (Event);
  rpc CreateBooking(CreateBookingRequest) returns (Booking);
  rpc GetAvailableTickets(GetTicketsRequest) returns (TicketList);
}

message GetEventRequest {
  string event_id = 1;
}

message Event {
  string id = 1;
  string name = 2;
  int64 date = 3;
  Venue venue = 4;
}
```

From the Protobuf definition, gRPC can generate strongly typed client and server code in multiple languages. This enables, for example, a Python service to communicate reliably with a Java service.

### REST vs. RPC

| REST | RPC / gRPC |
| --- | --- |
| Best for public or client-facing APIs | Best for internal services |
| Standard HTTP and human-readable JSON | Often compact binary protocols |
| Easy for browsers, mobile apps, and third parties | Requires clients and servers to agree on the protocol |
| Easy to inspect and debug | Efficient and strongly typed |

Use REST externally because external clients are diverse and benefit from universal HTTP/JSON compatibility. Use RPC internally when the organization controls both clients and servers.

---

## Pagination

Pagination prevents a list endpoint from returning an unbounded number of records in one large, slow response.

### Page/Offset-Based Pagination

```http
GET /events?page=1&limit=25
```

This is simple and usually sufficient. Page 1 returns items 1-25; page 2 returns items 26-50.

### Cursor-Based Pagination

```http
GET /events?cursor=123&limit=25
```

The cursor identifies where the next page should start, often using the ID or sort key of the last item from the previous response.

Cursor pagination is preferable for frequently changing datasets. Offset pagination can produce duplicates or missing items when new records are inserted between requests. A stable cursor, used with a deterministic sort order, continues from the previously seen position.

---

## Authentication and Authorization

Call out authentication and authorization requirements for endpoints that change protected data.

```text
@auth: admin
POST /events
```

The annotation above is useful interview shorthand: only authenticated administrators may create events. It is not an HTTP or REST standard.

### Tokens in Request Headers

Credentials are commonly sent in HTTP headers:

- **JWT (JSON Web Token):** a signed token that contains session claims, such as the user identity, role, and expiry. The signature lets the server verify that the client did not alter the claims.
- **Session token:** an opaque random token. The server uses it to retrieve the user session and permissions from a database or cache.

### Do Not Trust User Identity from the Request Body

Avoid using a caller-supplied `userId` to determine who is acting:

```json
{
  "text": "My new post",
  "userId": "someone-else"
}
```

If the server trusts that `userId`, a malicious user could create content on another user's behalf. Instead, infer the acting user from the validated JWT or session token:

```json
{
  "text": "My new post"
}
```

The server associates the request with the authenticated identity from the header.

---

## Interview Checklist

1. Start from the functional requirements and core entities.
2. Use REST by default for external APIs.
3. Name REST resources with plural nouns, not action verbs.
4. Show only the highest-value endpoints.
5. Use path parameters for required identifiers, query parameters for optional filters, and request bodies for mutation data.
6. State concise response shapes and appropriate `2xx`, `4xx`, and `5xx` outcomes.
7. Use GraphQL when clients need flexible, nested, field-specific responses; mention batching/DataLoader for N+1 prevention.
8. Use RPC/gRPC for efficient internal service communication.
9. Add pagination for potentially large result sets; favor cursors for write-heavy feeds.
10. State which endpoints require authentication and which roles are authorized.
11. Derive the acting user from authenticated credentials, not from a user ID supplied by the client.
