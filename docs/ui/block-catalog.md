# Block Catalog

> **Audience**: Developers, plugin authors

This document catalogs all UI blocks in the 3D Commerce platform with their props, behavior, and rendering rules.

## Block Categories

| Category | Count | Purpose |
|----------|-------|---------|
| [Layout](#layout-blocks) | 5 | Page structure |
| [Commerce](#commerce-blocks) | 8 | E-commerce functionality |
| [Navigation](#navigation-blocks) | 4 | Site navigation |
| [Content](#content-blocks) | 5 | Content display |
| [AI](#ai-blocks) | 3 | AI-generated elements |

---

## Layout Blocks

### Container

**ID**: `block-container`

Basic layout container with responsive width.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| maxWidth | string | "1200px" | Maximum width |
| padding | string | "1rem" | Inner padding |
| centered | boolean | true | Center in viewport |

```jsx
<Container maxWidth="1400px" centered>
  {children}
</Container>
```

### Grid

**ID**: `block-grid`

CSS Grid-based layout.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| columns | number/string | 3 | Column count or template |
| gap | string | "1rem" | Grid gap |
| minItemWidth | string | "250px" | Minimum item width |

**Device Behavior**:
- Desktop: Uses specified columns
- Tablet: max(2, columns/2)
- Mobile: 1 column

### Stack

**ID**: `block-stack`

Vertical or horizontal stack.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| direction | "vertical"/"horizontal" | "vertical" | Stack direction |
| gap | string | "1rem" | Item spacing |
| align | string | "stretch" | Alignment |

### Sidebar

**ID**: `block-sidebar`

Two-panel layout with sidebar.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| sidebarPosition | "left"/"right" | "left" | Sidebar position |
| sidebarWidth | string | "280px" | Sidebar width |
| collapsible | boolean | true | Allow collapse |

**Device Behavior**:
- Desktop: Side-by-side
- Mobile: Collapsible overlay

### Modal

**ID**: `block-modal`

Overlay dialog.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| open | boolean | false | Visibility |
| onClose | function | required | Close handler |
| size | "sm"/"md"/"lg" | "md" | Dialog size |

---

## Commerce Blocks

### ProductCard

**ID**: `block-product-card`

Single product display card.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| product | Product | required | Product data |
| variant | "default"/"compact" | "default" | Card style |
| showAddToCart | boolean | true | Show add button |

### ProductGrid

**ID**: `block-product-grid`

Grid of product cards.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| products | Product[] | [] | Products to display |
| columns | number | 3 | Grid columns |
| loading | boolean | false | Loading state |

### Cart

**ID**: `block-cart`

Shopping cart display.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | CartItem[] | required | Cart items |
| onRemove | function | required | Remove handler |
| onQuantityChange | function | required | Quantity handler |

### Checkout

**ID**: `block-checkout`

Checkout flow container.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| step | number | 1 | Current step |
| onComplete | function | required | Completion handler |

### FilterPanel

**ID**: `block-filter-panel`

Product filtering interface.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| filters | Filter[] | [] | Available filters |
| selected | object | {} | Current selections |
| onChange | function | required | Filter change handler |

### SearchBar

**ID**: `block-search-bar`

Product search input.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| placeholder | string | "Search..." | Placeholder text |
| onSearch | function | required | Search handler |
| suggestions | boolean | true | Show suggestions |

### PriceDisplay

**ID**: `block-price`

Formatted price display.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| amount | number | required | Price value |
| currency | string | "USD" | Currency code |
| showOriginal | boolean | false | Show strikethrough |

### OrderSummary

**ID**: `block-order-summary`

Order totals display.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | OrderItem[] | required | Line items |
| showTax | boolean | true | Display tax |
| showShipping | boolean | true | Display shipping |

---

## Navigation Blocks

### Header

**ID**: `block-header`

Site header with navigation.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| logo | string | required | Logo URL |
| navItems | NavItem[] | [] | Navigation items |
| showCart | boolean | true | Show cart icon |

### Footer

**ID**: `block-footer`

Site footer.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| columns | FooterColumn[] | [] | Footer sections |
| copyright | string | required | Copyright text |

### Breadcrumb

**ID**: `block-breadcrumb`

Navigation breadcrumbs.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | BreadcrumbItem[] | required | Path items |
| separator | string | "/" | Separator character |

### Menu

**ID**: `block-menu`

Navigation menu.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| items | MenuItem[] | required | Menu items |
| variant | "horizontal"/"vertical" | "horizontal" | Layout |

---

## Content Blocks

### Hero

**ID**: `block-hero`

Hero banner section.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | required | Main heading |
| subtitle | string | null | Subheading |
| backgroundImage | string | null | BG image URL |
| cta | CTAProps | null | Call to action |

### TextBlock

**ID**: `block-text`

Rich text content.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| content | string | required | HTML/Markdown |
| alignment | "left"/"center"/"right" | "left" | Text align |

### ImageBlock

**ID**: `block-image`

Image display.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | string | required | Image URL |
| alt | string | required | Alt text |
| aspectRatio | string | "auto" | Aspect ratio |

### VideoBlock

**ID**: `block-video`

Video player.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | string | required | Video URL |
| poster | string | null | Poster image |
| autoplay | boolean | false | Auto-play |

### Testimonial

**ID**: `block-testimonial`

Customer testimonial.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| quote | string | required | Quote text |
| author | string | required | Author name |
| image | string | null | Author image |

---

## AI Blocks

### GeneratedLayout

**ID**: `block-ai-layout`

AI-suggested layout container.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| layoutId | string | required | Layout ID |
| onApply | function | required | Apply handler |
| onReject | function | required | Reject handler |

**Security**: Read-only preview until user approves.

### GeneratedPreview

**ID**: `block-ai-preview`

Preview of AI suggestions.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| suggestions | Suggestion[] | required | AI suggestions |
| showDiff | boolean | true | Show changes |

### AIPlaceholder

**ID**: `block-ai-placeholder`

Placeholder for AI-generated content.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| generating | boolean | false | Loading state |
| prompt | string | null | Generation prompt |

---

## Related

- [Theme System](./theme-system.md)
- [Plugin UI Injection](./plugin-ui-injection.md)
- [ADR: Block-Based UI](../architecture/adr/002-block-based-ui.md)
