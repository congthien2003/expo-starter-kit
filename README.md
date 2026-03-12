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
| 🔐 **Auth Pattern** | `AuthProvider` wired up and ready for your authentication flow |
| 🗂 **File-Based Routing** | Expo Router v6 with tabs + modal screen patterns |
| 🛠 **Modern Stack** | React 19 · TypeScript strict · Zustand · React Hook Form + Zod |

---

## 🧰 Tech Stack

```
Expo SDK 54         → Build system, OTA updates
Expo Router v6      → File-based navigation
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
│   └── themed-text.tsx
├── context/
│   └── NotificationProvider.tsx  # Push notification context
├── hooks/
│   ├── usePushNotifications.ts   # Push notification hook
│   └── use-theme-color.ts
├── providers/
│   └── authProvider.tsx          # Authentication context
├── docs/
│   └── DESIGN_GUIDELINE.md       # Design system specification
└── tailwind.config.js            # Design token configuration
```

---

## 🎨 Design System

All color tokens are defined in `tailwind.config.js` and documented in `docs/DESIGN_GUIDELINE.md`.

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

> **Note:** Push tokens only work on **physical devices**. Simulators will log a warning but won't crash.

### For production push (server-side)

Use the token with [Expo Push Notification API](https://docs.expo.dev/push-notifications/sending-notifications/) or FCM/APNs directly.

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npx expo start

# 3. Open on device
#    → Scan QR code with Expo Go
#    → Press 'a' for Android emulator
#    → Press 'i' for iOS simulator
```

### Environment Setup

For push notifications, add your EAS project ID in `app.json`:

```json
{
  "extra": {
    "eas": {
      "projectId": "your-eas-project-id"
    }
  }
}
```

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Open on Android |
| `npm run ios` | Open on iOS |
| `npm run web` | Open in browser |
| `npm run lint` | Run ESLint |
| `npm run reset-project` | Reset to blank starter |

---

## 📖 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [NativeWind](https://www.nativewind.dev/)
- [react-native-size-matters](https://github.com/nirsky/react-native-size-matters)
- [expo-notifications Guide](https://docs.expo.dev/push-notifications/overview/)
- [Design Guideline](./docs/DESIGN_GUIDELINE.md)

