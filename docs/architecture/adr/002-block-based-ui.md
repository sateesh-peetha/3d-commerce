# ADR 002: Block-Based UI Architecture

## Status
**Accepted** - 2026-01-20

## Context
We needed a UI architecture that supports:
- Consistent rendering across devices
- Plugin UI injection without breaking core
- AI-assisted layout optimization
- Easy maintenance and extension

## Decision
We chose a **block-based UI architecture** where all user interfaces are composed of standardized, reusable blocks with strict contracts.

## Rationale

### Why Blocks

| Approach | Flexibility | Safety | AI-Compatible |
|----------|-------------|--------|---------------|
| Freeform components | High | Low | No |
| **Block-based** | Medium | **High** | **Yes** |
| Template-only | Low | High | Limited |

### Key Benefits

1. **Contract enforcement** - Each block has defined props and behavior
2. **Safe extension** - Plugins inject into designated slots only
3. **AI optimization** - Blocks can be reordered by AI within rules
4. **Device adaptation** - Blocks know how to render per device
5. **Consistency** - Standard patterns across the application

### Block Categories

```
Blocks (25 types)
├── Layout (5)
│   ├── Container
│   ├── Grid
│   ├── Stack
│   ├── Sidebar
│   └── Modal
├── Commerce (8)
│   ├── ProductCard
│   ├── ProductGrid
│   ├── Cart
│   ├── Checkout
│   ├── OrderSummary
│   ├── FilterPanel
│   ├── SearchBar
│   └── PriceDisplay
├── Navigation (4)
│   ├── Header
│   ├── Footer
│   ├── Breadcrumb
│   └── Menu
├── Content (5)
│   ├── Hero
│   ├── TextBlock
│   ├── ImageBlock
│   ├── VideoBlock
│   └── Testimonial
└── AI (3)
    ├── GeneratedLayout
    ├── GeneratedPreview
    └── AIPlaceholder
```

### Trade-offs Accepted

1. **Less flexibility** - Cannot create arbitrary UI
2. **Block explosion** - May end up with many block types
3. **Learning curve** - Developers must understand block system

## Consequences

### Positive
- Plugins cannot break core UI
- AI can safely optimize layouts
- Consistent user experience
- Easier testing (block-level)

### Negative
- Custom designs require new blocks
- Block contracts must be maintained
- Initial design system investment

## Alternatives Considered

### Freeform Components
- Maximum flexibility
- No safety guarantees
- AI cannot safely modify

### Page Templates
- Very consistent
- Too rigid for customization
- Plugins cannot inject UI

### Widget Framework
- Similar to blocks but less structured
- Harder to enforce contracts
- More prone to inconsistency

## Related
- [Block Catalog](../../ui/block-catalog.md)
- [ADR 003: Agentic Architecture](./003-agentic-architecture.md)
- [Theme System](../../ui/theme-system.md)
