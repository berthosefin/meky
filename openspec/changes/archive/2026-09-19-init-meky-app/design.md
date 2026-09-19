## Context

See proposal.md - Why. Greenfield Android-only app, no existing codebase. Repo at `/home/thos/Projets/meky`, currently empty (git initialized, no commits). Stack decided with the user: Expo + TypeScript, Expo Router, NativeWind, MMKV, USSD via `ACTION_DIAL`, EAS Build + GitHub Releases for distribution, conventional commits.

## Goals / Non-Goals

**Goals:**
- A minimal, reliable MVP: 3 screens (Home, Add/Edit, Execute) over a small local data model.
- USSD execution that works on modern Android dialers without special permissions.
- Clean baseline: linting, TypeScript strict, conventional commits tooling from day one.

**Non-Goals:**
- iOS support (blocked by platform USSD limitations).
- History of executions, import/export, categories/operators — deferred to future changes.
- Multi-device sync, accounts, backend.
- Play Store submission.

## Decisions

### 1. Expo (prebuild) rather than bare React Native CLI
Expo SDK gives us Expo Router, MMKV via config plugin support, and one-command cloud builds with EAS. The app needs a small native touch only for USSD launch; `Linking.openURL` with a `tel:` URI covers that without any custom native module. If OEM dialer quirks force a custom module later, Expo prebuild supports config plugins without ejecting.
- Alternative considered: bare RN CLI — more control, but slower DX and no EAS benefit; not justified for this scope.

### 2. USSD launch via `Linking.openURL('tel:' + encoded)` (ACTION_DIAL)
The formula `#1*4*1*...*...#` is percent-encoded (`#` → `%23`, `*` → `%2A`) into a `tel:` URI and opened with React Native `Linking`. The system dialer recognizes the USSD pattern and launches the session. No `CALL_PHONE` permission needed, works on Android 8+ where `ACTION_CALL` for USSD is restricted.
- Alternative: `ACTION_CALL` — removed (Android 8+ restriction + permission).
- Alternative: dedicated lib (`react-native-ussd`) — evaluated as escape hatch only if dialers don't auto-launch on target devices.

### 3. Variable syntax `{NOM}` parsed from the formula
One source of truth: the formula string. Variables are extracted by regex (`/\{([^}]+)\}/g`), deduplicated in order of first appearance. Editing the formula re-derives the variable list on save. This avoids a separate variable-editing UI in the MVP.
- Alternative: explicit variable editor UI — more flexible but doubles the form complexity; not needed for MVP.

### 4. MMKV for storage
`react-native-mmkv` stores a single JSON array of codes (or key-per-code) synchronously. Volumes are tiny (tens of codes), so a full read/write on mutation is acceptable and keeps the storage layer trivially simple. Works fully offline.
- Alternatives: AsyncStorage (slower, async-only), expo-sqlite (overkill for this volume).

### 5. NativeWind + custom shadcn-style components
Tailwind-inspired styling closest to shadcn's mental model, with a small set of hand-rolled components (Card, Button, Input, Label, EmptyState, Header) behind a single theme file (colors, spacing, radii). Clean and modern without pulling in a heavy design system.
- Alternatives: Tamagui (heavier crossover), Gluestack UI v1 (stability issues), RN Paper (Material, off-brand).

### 6. Expo Router file-based navigation
Three routes mirror the schema: `app/index`, `app/code/new`, `app/code/[id]`. Standard Expo pattern, typed routes available.
- Alternative: React Navigation manually — Expo Router already wraps it; file-based is less boilerplate.

### 7. EAS Build for APK + GitHub Releases for distribution
`eas build --platform android --profile preview` produces an installable APK uploaded to GitHub Releases on the private repo. No Play Store in MVP.
- Alternative: local Gradle (`eas build:configure` / expo run:android) — slower, requires Android SDK locally.

### 8. commitlint + husky for conventional commits
Commit messages in English following conventional commits, enforced by commitlint (on-commit-msg hook) on a private GitHub repo.

## Risks / Trade-offs

- [Dialer may not auto-launch the USSD session on every OEM] → Spike first: manual test of `*#...%23` in the dialer; if needed, add a native module that pre-fills dialer and documents the extra "Call" tap. Design keeps execution behind a single function so this is a localized change.
- [`tel:` URI handling can vary across Android versions] → Use `Linking.canOpenURL` before opening; surface a clear error (spec: "Aucun dialer disponible").
- [Samsung/OEM USSD length or separator quirks] → MVP validates with user's device in the spike; note findings in the code.
- [No way to unit-test actual dialer behavior on CI/emulator] → Keep the encode logic pure and unit-tested; the dialer call itself is verified manually.
- [Name collision: two codes with same name] → Names are not enforced unique in MVP; list disambiguates by formula preview.

## Migration Plan

Greenfield: no existing data or deployment. Rollback strategy is not applicable; keep git history clean so any change can be reverted via conventional commits.

## Open Questions

None blocking the MVP. Dialer auto-launch behavior is confirmed via the spike before/during task 2 implementation and does not change the specs (both outcomes still need the `tel:` open).