# ADR 001: Firebase Selection

## Status
**Accepted** - 2026-01-15

## Context
We needed to select a backend platform for the 3D Commerce application that provides:
- Authentication
- Database
- File storage
- Serverless functions
- Hosting

## Decision
We chose **Firebase** (with underlying GCP infrastructure) as the primary backend platform.

## Rationale

### Why Firebase

| Factor | Firebase | Alternative (AWS) |
|--------|----------|-------------------|
| Auth integration | Built-in, easy | Cognito + setup |
| Database | Firestore, realtime | DynamoDB |
| Storage | Integrated | S3 + setup |
| Functions | Gen 2, fast cold start | Lambda |
| Hosting | CDN included | CloudFront + S3 |
| Cost at scale | Pay-per-use | Pay-per-use |
| Local dev | Emulator suite | LocalStack |

### Key Benefits

1. **Single SDK** - One import for auth, database, storage
2. **Security rules** - Declarative, testable
3. **Emulator suite** - Full local development
4. **GCP escape hatch** - Can use raw GCP services
5. **Community** - Large ecosystem, good docs

### Trade-offs Accepted

1. **Vendor lock-in** - Mitigated by service abstraction layer
2. **Query limitations** - Firestore has limited query capabilities
3. **Cold starts** - Managed via min instances in production
4. **Cost at very high scale** - May need to optimize or migrate

## Consequences

### Positive
- Faster development velocity
- Integrated security model
- Simpler deployment
- Lower initial operational burden

### Negative
- Team needs Firebase expertise
- Some complex queries require denormalization
- Costs less predictable than reserved capacity

## Alternatives Considered

### AWS Amplify
- More powerful but more complex
- Steeper learning curve
- Better for teams with AWS experience

### Supabase
- PostgreSQL-based (more familiar)
- Less mature ecosystem
- Good for SQL-heavy workloads

### Self-hosted
- Maximum control
- Highest operational burden
- Not appropriate for small team

## Related
- [ADR 002: Block-Based UI](./002-block-based-ui.md)
- [Architecture Deep Dive](../architecture-deep-dive.md)
