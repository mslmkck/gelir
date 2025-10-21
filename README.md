# Modern Full-Stack Web App Foundation

A production-ready Next.js 14 application with TypeScript, TailwindCSS, Headless UI, and comprehensive tooling setup.

## 🚀 Features

- **Next.js 14** with App Router for full-stack capabilities
- **TypeScript** for type safety
- **TailwindCSS** with custom theme tokens and design system
- **Headless UI** for accessible, unstyled UI components
- **Responsive Layout** with navigation and sidebar
- **Comprehensive UI Primitives** ready for use
- **Installable Progressive Web App** with offline caching, dictionary data, and update notifications
- **ESLint** and **Prettier** for code quality
- **Husky** and **lint-staged** for pre-commit hooks

## 📦 Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** TailwindCSS 3.4
- **UI Components:** Headless UI, Heroicons
- **Linting:** ESLint
- **Formatting:** Prettier
- **Git Hooks:** Husky + lint-staged

## 🎨 Custom Theme

The project includes a comprehensive design system with:

- **Color Palette:** Primary, Secondary, Neutral, Success, Warning, Error
- **Custom Spacing:** Extended spacing scale
- **Typography:** Custom font sizes and line heights
- **Shadows:** Soft shadows for elevated UI
- **Border Radius:** Extended radius options

## 🧩 UI Components

### Layout Components

- **AppLayout:** Main application layout with sidebar and navigation
- **Navigation:** Top navigation bar with search and user menu
- **Sidebar:** Collapsible sidebar with navigation links

### UI Primitives

- **Button:** Multiple variants (primary, secondary, outline, ghost, danger) and sizes
- **Card:** Flexible card component with header, content, and footer sections
- **Input:** Text input with label, error, and helper text support
- **Textarea:** Multi-line text input
- **Select:** Dropdown select component
- **Checkbox:** Checkbox with label support

## 🛠️ Development

### Prerequisites

- Node.js 18+ and npm

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## 📁 Project Structure

```
.
├── app/                    # Next.js App Router
│   ├── api/dictionary/    # Offline-ready dictionary API
│   ├── fonts/             # Local fonts
│   ├── globals.css        # Global styles and CSS variables
│   ├── layout.tsx         # Root layout
│   ├── manifest.ts        # PWA manifest definition
│   ├── offline/           # Offline fallback route
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── home/             # Lazy loaded homepage sections
│   ├── layout/           # Layout components
│   │   ├── AppLayout.tsx
│   │   ├── Navigation.tsx
│   │   └── Sidebar.tsx
│   ├── pwa/              # Install prompts and update notifications
│   └── ui/               # UI primitives
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Checkbox.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       └── Textarea.tsx
├── public/               # Static assets, manifest icons, service worker
│   ├── icons/
│   └── service-worker.js
├── .husky/               # Git hooks
├── tailwind.config.ts    # TailwindCSS configuration
├── tsconfig.json         # TypeScript configuration
├── .eslintrc.json        # ESLint configuration
├── .prettierrc           # Prettier configuration
└── package.json          # Dependencies and scripts
```

## 📱 Progressive Web App

### Offline experience

- `/public/service-worker.js` caches the application shell, `/offline` route, and the dictionary API for use without a network connection.
- `/app/offline` provides a branded fallback view that keeps users informed when the network is unavailable.
- Critical assets such as icons, fonts, and the manifest are precached so reloads remain fast.

### Installation & updates

- Users receive an install banner surfaced by `components/pwa/PWAProvider`, which listens for the `beforeinstallprompt` event.
- The provider also surfaces update notifications that call `postMessage({ type: "SKIP_WAITING" })` on the waiting worker and refresh the page once the new version is active.
- Additional metadata in `app/layout.tsx` (manifest, theme colors, prefetch hints) ensures the app passes Lighthouse PWA checks.

### Testing & maintenance

- Service worker registration logic is covered by `tests/unit/serviceWorkerRegistration.test.ts`.
- Run `npm run test` to execute the Vitest suite, including the new unit tests and existing integration tests.

## 🎯 Usage Examples

### Using Layout

```tsx
import { AppLayout } from "@/components/layout";

export default function Page() {
  return (
    <AppLayout>
      <h1>Your content here</h1>
    </AppLayout>
  );
}
```

### Using UI Components

```tsx
import { Button, Card, Input } from "@/components/ui";

export default function Example() {
  return (
    <Card variant="bordered">
      <Input label="Email" type="email" fullWidth />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

## 🔧 Configuration

### TailwindCSS

Custom theme tokens are defined in `tailwind.config.ts`. Extend or modify colors, spacing, and other design tokens as needed.

### ESLint & Prettier

- ESLint configuration: `.eslintrc.json`
- Prettier configuration: `.prettierrc`

Both are integrated with pre-commit hooks via Husky and lint-staged.

## 🚦 Git Hooks

Pre-commit hooks are configured to:

- Run ESLint and auto-fix issues
- Format code with Prettier
- Ensure code quality before commits

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all linting and type checks pass
4. Submit a pull request

---

Built with ❤️ using Next.js 14
