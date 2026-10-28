# AQAR IN — Mobile Applications Blueprint (iOS & Android)

**Target Platforms:** Apple iOS 16+ & Android 12+ (API 31+)  
**Technology:** React Native with TypeScript & Expo Application Services (EAS)  
**Author:** Principal Mobile Solutions Architect  
**Status:** Approved Mobile Implementation Blueprint

---

## 1. Mobile Technology Decision & Justification

### The Chosen Framework: **React Native with TypeScript & Expo (Managed Workflow)**

```text
+-----------------------------------------------------------------------------------+
|                        AQAR IN MOBILE ECOSYSTEM                                  |
+-----------------------------------------------------------------------------------+
|  Shared UI Tokens (Tailwind/NativeWind) | Shared TypeScript Types & API Contracts |
+-----------------------------------------------------------------------------------+
|                         React Native 0.76+ & React 18                             |
+-----------------------------------------------------------------------------------+
|        iOS Native Engine (Swift/ObjC)    |    Android Native Engine (Kotlin/Java) |
+-----------------------------------------------------------------------------------+
```

### Why React Native with Expo over Flutter or Pure Native?
1. **Maximum Code & Model Reuse:** The existing AQAR IN web application is built in **React 18 and Tailwind CSS**. Adopting React Native allows **100% reuse** of TypeScript data models, API client logic, validation schemas, bilingual strings, and design tokens (via `nativewind`).
2. **True Native Performance (Zero WebViews):** React Native with the New Architecture (Fabric renderer + TurboModules) renders 100% native UIKit components on iOS and Android Jetpack views on Android, providing 60/120 FPS animations.
3. **Enterprise Cloud Build Pipeline (EAS):** Expo Application Services (EAS Build & EAS Submit) allows automated cloud builds for both iOS (`.ipa`) and Android (`.aab`) with automated code signing, certificates, and direct publishing to TestFlight and Google Play Internal Testing.
4. **Instant Over-The-Air (OTA) Updates:** Critical bug fixes, text updates, and valuation multiplier adjustments can be pushed instantly via Expo Updates without waiting for App Store review.

---

## 2. Mobile Feature Parity Matrix

This matrix establishes exact feature parity between the existing web platform and the native mobile applications:

| Web Feature | Mobile iOS Support | Mobile Android Support | Mobile-Specific Enhancements |
| :--- | :--- | :--- | :--- |
| **User Sign-up / Login** | ✅ Supported | ✅ Supported | **Biometric Login** (Face ID / Touch ID / Fingerprint) via `expo-local-authentication`. |
| **Property Search & Discovery**| ✅ Supported | ✅ Supported | Native gesture-driven filters, bottom-sheet search dialogs. |
| **Interactive Map View** | ✅ Supported | ✅ Supported | Native Apple Maps on iOS, Google Maps on Android via `react-native-maps` with smooth clustering. |
| **Property Details Page** | ✅ Supported | ✅ Supported | Native paging image carousel, parallax header, haptic feedback on saving. |
| **Instant AI Valuation** | ✅ Supported | ✅ Supported | Native step-by-step wizard, interactive valuation gauge, native share sheet to export PDF. |
| **Mortgage Calculator** | ✅ Supported | ✅ Supported | Interactive sliders with live monthly installment calculation and bank card comparison. |
| **Lead / Inquiry Submission** | ✅ Supported | ✅ Supported | One-tap native dialer (`tel:`) and deep-link WhatsApp app launching (`whatsapp://send`). |
| **Saved Properties (Favorites)**| ✅ Supported | ✅ Supported | **Offline access**: Saved properties remain viewable without active internet connection. |
| **Fast Buy / Fast Sell** | ✅ Supported | ✅ Supported | Push notifications alerting users to newly verified flash cash deals. |
| **Exchange & Management** | ✅ Supported | ✅ Supported | Native photo upload from device camera/gallery with automatic compression. |
| **Language Toggle (AR/EN)** | ✅ Supported | ✅ Supported | Seamless RTL layout flipping using React Native's `I18nManager`. |

---

## 3. Mobile Architecture & State Management

### Project Directory Structure (`apps/mobile/`):
```text
mobile/
├── app/                    # Expo Router file-based routing
│   ├── (auth)/             # Login, Register, Forgot Password
│   ├── (tabs)/             # Tab Navigation: Home, Explore, Valuate, Saved, Profile
│   ├── property/[id].tsx   # Dynamic Property Details view
│   ├── valuation/          # Instant & Professional Valuation wizards
│   └── services/           # Fast Buy, Fast Sell, Exchange, Finishing
├── src/
│   ├── components/         # Shared native UI components
│   ├── services/           # API v1 Client (Axios with Auth interceptors)
│   ├── store/              # Zustand stores (AuthStore, FavoritesStore)
│   ├── hooks/              # Custom hooks (useProperties, useValuation, useLocation)
│   └── utils/              # Formatting (EGP, dates), biometric helpers
├── app.json                # Expo configuration & app identifiers
└── package.json
```

### State Management & Caching:
* **Server State:** **TanStack React Query v5** for caching API responses, background prefetching, and automatic retries on poor cellular networks.
* **Client State:** **Zustand** for lightweight global UI states (auth status, language, filter criteria).
* **High-Speed Storage:** **`react-native-mmkv`** (10x faster than standard AsyncStorage) for instant loading of cached listings.

---

## 4. Mobile Security & Token Lifecycle

1. **Secure Token Storage:**
   * Tokens are **never** stored in plain text or standard AsyncStorage.
   * On **iOS**: Stored in the native **iOS Keychain** via `expo-secure-store`.
   * On **Android**: Stored in the native **Android Keystore** with AES-256 GCM encryption.
2. **Silent Background Token Refresh:**
   * An Axios response interceptor detects `401 Unauthorized`.
   * Automatically dispatches a call to `/api/v1/auth/refresh` using the secure refresh token.
   * If valid, updates the access token and replays the failed request seamlessly without logging the user out.
3. **Session Revocation & Logout:**
   * Logging out immediately wipes the Keychain/Keystore and issues an invalidate call to the server to blacklist the refresh token in Redis.

---

## 5. Push Notifications & Deep Linking

### Push Notification Architecture:
* **Infrastructure:** **Firebase Cloud Messaging (FCM)** unified gateway integrated with **Apple Push Notification service (APNs)**.
* **Notification Types:**
  1. *Price Drop Alerts:* When a saved property's price is reduced.
  2. *Cash Offer Ready:* When an admin sends a valuation/cash offer for a Fast Sell request.
  3. *New Deal in Compound:* Instant alerts for matching compounds (e.g. Mivida, Allegria).

### Deep Linking (Universal Links):
* **iOS Universal Links:** `https://aqarin.com/property/:id` opens the exact property screen natively in the app.
* **Android App Links:** `https://aqarin.com/property/:id` mapped directly in `AndroidManifest.xml`.
* **Fallback:** If the app is not installed, the link opens seamlessly in Safari/Chrome on the responsive web platform.

---

## 6. Build, Signing & App Store Deployment Checklist

### iOS (Apple App Store):
* **Apple Developer Program:** Account registration & Organization D-U-N-S verification.
* **Bundle Identifier:** `com.aqarin.app`
* **Provisioning & Certificates:** Managed automatically via EAS CLI (`eas credentials`).
* **Privacy Permissions:** Explicit strings in `Info.plist` for `NSLocationWhenInUseUsageDescription` (map search) and `NSCameraUsageDescription` / `NSPhotoLibraryUsageDescription` (property photos).
* **TestFlight Distribution:** Automated nightly builds for internal beta testers.

### Android (Google Play Store):
* **Google Play Console:** Account setup & merchant verification.
* **Package Name:** `com.aqarin.app`
* **Release Artifact:** Android App Bundle (`.aab`) with Google Play App Signing.
* **Target SDK:** Android 14+ (API level 34).
