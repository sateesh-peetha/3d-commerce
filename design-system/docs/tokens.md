# Design Token Reference

Token-driven design system for the 3D Commerce Platform.

## Usage

```html
<link rel="stylesheet" href="tokens/base.css">
```

---

## Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#6366f1` | Main actions, emphasis |
| `--color-secondary` | `#0ea5e9` | Supporting elements |
| `--color-accent` | `#f59e0b` | Highlights, CTAs |
| `--color-background` | `#0f172a` | Main background |
| `--color-surface` | `#1e293b` | Cards, panels |
| `--color-text-primary` | `#f8fafc` | Primary text |
| `--color-text-secondary` | `#94a3b8` | Secondary text |
| `--color-success` | `#22c55e` | Success states |
| `--color-warning` | `#f59e0b` | Warning states |
| `--color-error` | `#ef4444` | Error states |

---

## Typography Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--font-size-heading-xl` | `3rem` | Hero headings |
| `--font-size-heading-lg` | `2.25rem` | Page headings |
| `--font-size-heading-md` | `1.5rem` | Section headings |
| `--font-size-body-regular` | `1rem` | Body text |
| `--font-size-body-small` | `0.875rem` | Small text |
| `--font-size-caption` | `0.75rem` | Captions, labels |

---

## Spacing Tokens

| Token | Value | Pixels |
|-------|-------|--------|
| `--space-xs` | `0.25rem` | 4px |
| `--space-sm` | `0.5rem` | 8px |
| `--space-md` | `1rem` | 16px |
| `--space-lg` | `1.5rem` | 24px |
| `--space-xl` | `2rem` | 32px |

---

## Elevation Tokens

| Token | Usage |
|-------|-------|
| `--elevation-none` | Flat elements |
| `--elevation-sm` | Subtle depth |
| `--elevation-md` | Cards, dropdowns |
| `--elevation-lg` | Modals, popovers |
| `--elevation-glow` | Primary glow effect |

---

## Motion Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--motion-fast` | `150ms` | Micro-interactions |
| `--motion-normal` | `300ms` | Standard transitions |
| `--motion-slow` | `500ms` | Page transitions |

---

## Theme Switching

```html
<!-- Dark theme (default) -->
<html>

<!-- Light theme -->
<html data-theme="light">
```

---

## Utility Classes

### Typography
- `.heading-xl`, `.heading-lg`, `.heading-md`, `.heading-sm`
- `.body-lg`, `.body-regular`, `.body-small`
- `.caption`

### Layout
- `.container` - Centered max-width container
- `.flex`, `.flex-col` - Flexbox
- `.grid`, `.grid-cols-{1-4}` - Grid layouts

### Spacing
- `.m-{xs,sm,md,lg,xl}` - Margin
- `.p-{xs,sm,md,lg,xl}` - Padding
- `.gap-{xs,sm,md,lg,xl}` - Gap

### Effects
- `.glass` - Glassmorphism dark
- `.glass-light` - Glassmorphism light
- `.gradient-primary` - Primary gradient
- `.gradient-text` - Gradient text effect
