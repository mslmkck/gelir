# UI Components Documentation

This document provides detailed information about the UI components available in this project.

## Table of Contents

- [Layout Components](#layout-components)
- [UI Primitives](#ui-primitives)

## Layout Components

### AppLayout

The main application layout component that includes navigation, sidebar, and content area.

```tsx
import { AppLayout } from "@/components/layout";

export default function Page() {
  return (
    <AppLayout>
      <h1>Your page content</h1>
    </AppLayout>
  );
}
```

**Features:**

- Responsive sidebar that collapses on mobile
- Top navigation with search and user menu
- Mobile-friendly with overlay

### Navigation

Top navigation bar with search, notifications, and user menu.

```tsx
import { Navigation } from "@/components/layout";

<Navigation onMenuClick={() => setSidebarOpen(true)} showMenuButton={true} />;
```

**Props:**

- `onMenuClick?: () => void` - Callback for menu button click
- `showMenuButton?: boolean` - Show/hide the mobile menu button

### Sidebar

Collapsible sidebar with navigation links.

```tsx
import { Sidebar } from "@/components/layout";

<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />;
```

**Props:**

- `isOpen?: boolean` - Control sidebar visibility
- `onClose?: () => void` - Callback when sidebar closes

## UI Primitives

### Badge

Status indicators and labels with various color variants.

```tsx
import { Badge } from "@/components/ui";

<Badge variant="success">Active</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
```

**Props:**

- `variant?: "primary" | "secondary" | "success" | "warning" | "error" | "neutral"` - Color variant
- `size?: "sm" | "md" | "lg"` - Size of the badge
- `className?: string` - Additional CSS classes

### Button

Flexible button component with multiple variants and sizes.

```tsx
import { Button } from "@/components/ui";

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>;
```

**Props:**

- `variant?: "primary" | "secondary" | "outline" | "ghost" | "danger"` - Button style
- `size?: "sm" | "md" | "lg"` - Button size
- `fullWidth?: boolean` - Make button full width
- All standard button HTML attributes

### Card

Flexible card container with header, content, and footer sections.

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui";

<Card variant="elevated">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Optional description</CardDescription>
  </CardHeader>
  <CardContent>Card content goes here</CardContent>
  <CardFooter>Footer content (optional)</CardFooter>
</Card>;
```

**Card Props:**

- `variant?: "default" | "bordered" | "elevated"` - Card style
- `padding?: "none" | "sm" | "md" | "lg"` - Internal padding
- `className?: string` - Additional CSS classes

**Sub-components:**

- `CardHeader` - Card header section
- `CardTitle` - Card title
- `CardDescription` - Card description/subtitle
- `CardContent` - Main content area
- `CardFooter` - Footer section

### Checkbox

Checkbox input with optional label.

```tsx
import { Checkbox } from "@/components/ui";

<Checkbox label="I agree to the terms" checked={agreed} onChange={handleChange} />;
```

**Props:**

- `label?: string` - Optional label text
- `error?: string` - Error message to display
- All standard checkbox input attributes

### Input

Text input field with label, error, and helper text support.

```tsx
import { Input } from "@/components/ui";

<Input
  label="Email"
  type="email"
  placeholder="your@email.com"
  error={errors.email}
  helperText="We'll never share your email"
  fullWidth
/>;
```

**Props:**

- `label?: string` - Input label
- `error?: string` - Error message (displays in red)
- `helperText?: string` - Helper text below input
- `fullWidth?: boolean` - Make input full width
- All standard input HTML attributes

### Select

Dropdown select component.

```tsx
import { Select } from "@/components/ui";

<Select
  label="Country"
  options={[
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
  ]}
  fullWidth
/>;
```

**Props:**

- `label?: string` - Select label
- `error?: string` - Error message
- `helperText?: string` - Helper text
- `fullWidth?: boolean` - Make select full width
- `options: { value: string; label: string }[]` - Select options (required)
- All standard select HTML attributes

### Textarea

Multi-line text input.

```tsx
import { Textarea } from "@/components/ui";

<Textarea
  label="Message"
  placeholder="Enter your message..."
  rows={4}
  error={errors.message}
  fullWidth
/>;
```

**Props:**

- `label?: string` - Textarea label
- `error?: string` - Error message
- `helperText?: string` - Helper text
- `fullWidth?: boolean` - Make textarea full width
- All standard textarea HTML attributes

## Theming

All components support dark mode automatically through TailwindCSS dark mode classes. The theme can be customized in `tailwind.config.ts`.

### Color Variants

- **Primary:** Blue - Main brand color
- **Secondary:** Purple - Secondary brand color
- **Success:** Green - Success states
- **Warning:** Yellow/Orange - Warning states
- **Error:** Red - Error states
- **Neutral:** Gray - Neutral/default states

### Responsive Breakpoints

- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

## Best Practices

1. **Import components from index files:**

   ```tsx
   import { Button, Card, Input } from "@/components/ui";
   ```

2. **Use semantic HTML:**
   - Buttons for actions
   - Links for navigation
   - Forms for data input

3. **Provide labels:**
   - Always provide labels for form inputs
   - Use descriptive button text

4. **Handle errors:**
   - Display validation errors inline
   - Use error variant for destructive actions

5. **Responsive design:**
   - Test components on different screen sizes
   - Use fullWidth prop when appropriate

## Examples

See `app/page.tsx` for comprehensive examples of all components in use.
