# 3D Commerce Design System

A token-driven, block-based UI system for 3D commerce and manufacturing platforms.

## Governing Principles

1. **Everything is a configurable UI block**
2. **All visuals are token-driven**
3. **All blocks are device-aware**
4. **All blocks are plugin-injectable**

## Quick Start

```bash
# Open design system browser
start index.html
```

## Structure

```
design-system/
├── tokens/                    # Design tokens
│   ├── design-tokens.css      # 60+ CSS custom properties
│   ├── tokens.json            # Machine-readable tokens
│   └── base.css               # Reset + utilities
│
├── blocks/                    # UI Block Library (22 blocks)
│   ├── navigation/            # Header, footer, tabs
│   ├── commerce/              # Products, cart, filters
│   ├── 3d-printing/           # Upload, viewer, config
│   ├── user/                  # Profile, orders
│   ├── admin/                 # KPIs, queues, printers
│   ├── ai/                    # Prompt, preview
│   └── shared/                # Buttons, inputs, badges
│
├── ai-tools/                  # AI Generation Tools
│   ├── theme-generator.css
│   ├── layout-generator.css
│   ├── decision-explainer.css
│   └── accessibility-validator.css
│
├── plugins/                   # Plugin System
│   ├── plugin-registry.css
│   ├── block-injection.css
│   └── plugin-config.css
│
├── validation/                # Validation & Governance
│   ├── validation-dashboard.css
│   ├── ai-review-panel.css
│   └── validation-rules.json
│
├── layouts/                   # Device-Specific Rules
│   └── device-rules.css
│
├── screens/                   # Screen Wireframes
│   ├── web/
│   │   ├── homepage.html
│   │   └── 3d-upload.html
│   └── admin/
│       └── dashboard.html
│
└── docs/
    └── tokens.md
```

## File Counts

| Category | Count |
|----------|-------|
| CSS Files | 33 |
| HTML Screens | 3 |
| JSON Configs | 2 |
| **Total** | **38** |

## Usage

### Import Tokens
```html
<link rel="stylesheet" href="design-system/tokens/base.css">
```

### Use Components
```html
<button class="btn btn--primary">Primary</button>
<span class="badge badge--success">Active</span>
```

### Compose Blocks
```html
<header class="block-header-main-nav">...</header>
<section class="block-product-grid">...</section>
```

## Design Tokens

| Token | Example |
|-------|---------|
| Colors | `var(--color-primary)`, `var(--color-surface)` |
| Typography | `var(--font-size-heading-lg)` |
| Spacing | `var(--space-md)`, `var(--space-xl)` |
| Elevation | `var(--elevation-lg)` |
| Motion | `var(--motion-fast)` |

## Responsive Breakpoints

- **Mobile**: `< 768px`
- **Tablet**: `768px - 1023px`
- **Desktop**: `≥ 1024px`

## License

Proprietary - All rights reserved.
