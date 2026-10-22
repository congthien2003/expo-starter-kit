# 🚀 Expo Starter Kit

A **production-ready** Expo starter kit with a pre-configured design system, responsive typography, reusable UI components, auth patterns, and push notification setup. Built for teams that want to ship fast without sacrificing quality.

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🎨 **Design System** | Tailwind / NativeWind with branded color palette (`primary`, `neutral`, `success`, `warning`, `danger`) |
| 📐 **Responsive Typography** | `react-native-size-matters` — all font sizes scale proportionally across screen sizes |
| 🧩 **Shared UI Components** | Button, Input, Badge, Card, Typography, QuantityInput, Loading, EmptyState, Collapsible, Divider |
| 🔔 **Push Notifications** | Full `expo-notifications` setup with permission handling, token retrieval, and context provider |
| 🔐 **Auth Feature** | Feature-based auth example with React Hook Form, Zod, SecureStore, and `AuthProvider` |
| 🗂 **File-Based Routing** | Expo Router 57 with tabs + modal screen patterns |
| 🛠 **Modern Stack** | React 19 · TypeScript strict · Zustand · React Hook Form + Zod |

---

## 🧰 Tech Stack

```
Expo SDK 57         → Expo tooling and native modules
Expo Router 57      → File-based navigation
NativeWind v4       → Tailwind CSS for React Native
react-native-size-matters → Adaptive font & layout scaling
expo-notifications  → Push notification handling
Zustand             → Lightweight global state
React Hook Form     → Form management
Zod                 → Runtime schema validation
Axios               → HTTP client
FlashList           → High-performance list rendering
expo-secure-store   → Secure token storage
```

---

## 📁 Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home screen
│   │   ├── components-demo.tsx # UI component showcase
│   │   ├── demo-login.tsx     # Thin route for the auth feature
│   │   └── explore.tsx
│   ├── _layout.tsx            # Root layout with providers
│   └── modal.tsx
├── components/
│   ├── ui/                    # Shared design-system components
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── typography.tsx     # Responsive Typography + size-matters
│   │   ├── loading.tsx
│   │   ├── empty-state.tsx
│   │   ├── quantity-input.tsx
│   │   ├── collapsible.tsx
│   │   ├── divider.tsx
│   │   ├── safe-area.tsx
│   │   └── modal.tsx
├── features/
│   └── auth/
│       ├── components/        # Auth-only screens and UI
│       ├── hooks/             # Auth-only hooks
│       ├── providers/         # Auth context provider
│       ├── schemas/           # Zod validation schemas
│       ├── services/          # Auth API and persistence flow
│       ├── types/             # Auth request, response, and entity types
│       └── index.ts           # Public exports
├── context/
│   └── NotificationProvider.tsx  # Push notification context
├── hooks/
│   └── usePushNotifications.ts   # Push notification hook
└── tailwind.config.js            # Design token configuration
```

### Feature-based Architecture

Keep route files in `app/` focused on navigation and compose each business capability under `features/<feature>/`. Feature-specific components, hooks, schemas, types, services, providers, stores, and utilities stay with that feature. Create only the folders the feature actually uses.

Reusable design-system and common components remain in the root `components/` directory. Cross-feature infrastructure such as the Axios client and token storage remains in `lib/` or `utils/`.

The `auth` feature is the reference implementation:

```tsx
import { AuthProvider, LoginScreen, useAuth } from "@/features/auth";
```

---

## 🎨 Design System

All color tokens are defined in `tailwind.config.js` and consumed through NativeWind utility classes. There is no separate TypeScript theme configuration.

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-500` | `#3b82f6` | Main brand, buttons, active states |
| `neutral-50` | `#f8fafc` | App background |
| `neutral-900` | `#0f172a` | Headings |
| `neutral-800` | `#1e293b` | Body text |
| `neutral-400` | `#94a3b8` | Placeholder, disabled |
| `success-500` | `#22c55e` | Confirmed, completed |
| `warning-500` | `#eab308` | Pending, caution |
| `danger-500` | `#ef4444` | Error, cancel |

### Typography

Uses `react-native-size-matters` (`s()`) to scale font sizes proportionally based on device width.

```tsx
import { Heading1, Body, Caption, Typography } from "@/components/ui/typography";

<Heading1>Dashboard</Heading1>
<Body color="muted">Secondary content here</Body>
<Caption>12px · auto-scaled</Caption>
<Typography variant="h3" color="primary" weight="semibold">Custom</Typography>
```

### UI Components

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Button variants: primary | secondary | outline | ghost | destructive
<Button variant="primary" size="md" onPress={...}>Submit</Button>

// Input with label, error, hint, icons, password toggle
<Input label="Email" error="Invalid email" hint="Used for login" />

// Semantic badge
<Badge variant="success">Completed</Badge>
<Badge variant="danger">Cancelled</Badge>

// Card variants: elevated | outlined | filled
<Card variant="elevated"><Body>Card content</Body></Card>
```

---

## 🔔 Push Notifications

Pre-configured with `expo-notifications`. Handles permissions, token retrieval, foreground/background events.

### Usage

```tsx
// The provider is already wrapped in app/_layout.tsx
// Just consume the context anywhere in your app:

import { useNotificationContext } from "@/context/NotificationProvider";

export function MyScreen() {
  const { expoPushToken, notification, permissionStatus } = useNotificationContext();

  return (
    <View>
      <Text>Token: {expoPushToken?.data}</Text>
      <Text>Permission: {permissionStatus}</Text>
    </View>
  );
}
```

> **Note:** Push tokens only work on **physical devices**. Remote push notifications are unavailable in Expo Go on Android, so use a development build when testing push; Expo Go remains suitable for screens that do not require remote push.

### For production push (server-side)

Use the token with [Expo Push Notification API](https://docs.expo.dev/push-notifications/sending-notifications/) or FCM/APNs directly.

---

## 🚀 Getting Started

```bash
# 1. Install the exact dependency tree committed in package-lock.json
npm ci

# 2. Start the development server
npx expo start

# 3. Open on device
#    → Scan QR code with Expo Go
#    → Press 'a' for Android emulator
#    → Press 'i' for iOS simulator
```

### Dependency policy

Use **npm** and the committed `package-lock.json` for reproducible installs. Do not alternate npm and Bun installs: an existing local `bun.lock` is not the authoritative lockfile and is not maintained by this update.

This project targets Expo `~57.0.31`, React Native `0.86.3`, and React/React DOM `19.2.3`. Native package versions follow Expo's SDK 57 compatibility matrix, rather than each package's independent `latest` tag. Rebuild native development clients after changing native dependencies.

- NativeWind stays on `4.2.7` with Tailwind CSS `3.4.19`: its CSS interop dependency requires Tailwind 3.
- React Hook Form resolvers stays on `5.9.2`, which supports Zod 4 and React Hook Form 7. Installing resolvers 6 produced an npm peer conflict between its optional Effect 4 requirement and the Effect 3 requirement in the existing TypeSchema dependency tree.
- ESLint stays on 9: the React and import plugins do not declare support for ESLint 10. npm reports ESLint 9 as no longer supported; this is a known tooling limitation until the plugin chain supports a newer major.
- TypeScript stays on `6.0.3`: the TypeScript ESLint parser does not yet declare support for TypeScript 7.
- Expo 58 is deferred until compatibility of the existing NativeWind pipeline is established and platform smoke tests pass. This is a compatibility precaution, not a confirmed Expo 58 defect.

### Environment Setup

Use a Node.js version supported by the selected Expo SDK and React Native packages. For remote push, use a **native development build on a physical device**, with FCM/APNs credentials configured; Expo Go is not a substitute for testing this flow.

For push notifications, merge your EAS project ID into the existing `expo` object in `app.json`:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-eas-project-id"
      }
    }
  }
}
```

The notification hook skips native push registration on web. Missing project configuration or token request failures do not produce a token; token failures preserve the permission status already obtained. Registration failures are logged without exposing tokens. Notification-tap navigation remains an application-specific TODO.

### Verification after updating dependencies

The installation completed with npm blocking the `unrs-resolver@1.11.1` postinstall script under its install-script approval policy. Do not disable that policy globally. Review the package and script with `npm install-scripts ls`; if you trust it, explicitly approve it with `npm install-scripts approve unrs-resolver` and follow npm's instructions. Its effect on lint tooling has not been verified.

Run these checks yourself after installing dependencies:

```bash
npm ls
npx expo install --check
npx expo-doctor@latest
npm run typecheck
npm run lint
npm audit
```

Expect no invalid/missing dependencies, SDK version mismatches, or type/lint regressions. Review audit findings individually; do not use `npm audit fix --force` to bypass compatibility constraints. These checks do not prove runtime compatibility.

Then start the app with `npx expo start --clear` (or `npx expo start --dev-client` for your rebuilt development client) and check:

- **Android/iOS/web:** tabs, modal open/close, login validation, successful/failed login against your configured backend, session restoration and logout.
- **UI:** NativeWind colors and spacing, icons/fonts, keyboard avoidance, safe-area insets, scrolling and Reanimated transitions.
- **Physical Android/iOS development builds:** grant/deny notification permission, retrieve a token with valid EAS credentials, receive a foreground notification, and handle missing project configuration or network failure without an unhandled rejection.
- **Web:** startup must not request native notification permissions or register native push listeners.

No automated test suite is configured. Platform smoke tests and native builds are required before claiming production readiness for this upgrade.

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Open on Android |
| `npm run ios` | Open on iOS |
| `npm run web` | Open in browser |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Check TypeScript without emitting files |
| `npm run reset-project` | Reset to blank starter |

---

## 📖 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [NativeWind](https://www.nativewind.dev/)
- [react-native-size-matters](https://github.com/nirsky/react-native-size-matters)
- [expo-notifications Guide](https://docs.expo.dev/push-notifications/overview/)

