# Redesign UI Mobile — Smart Waste Management

Mode: REDESIGN (R78). Stack: Expo 58, RN 0.88, React 19, TS. No new deps.

## Direction
- Brand: emerald (lingkungan). Material Design 3 influence (R3).
- Civic reporting pattern: header greeting, segmented tabs (Buat/Riwayat), photo-preview hero card, prediction chip, location pill, full-width CTA.
- Anti-slop (R45): no gradient hero, no 3-col identical cards, no generic copy. Copy in Bahasa Indonesia santai (R75).

## Tokens (src/theme.ts)
- Colors: background/surface/card/textPrimary/textSecondary/border/primary(+Pressed)/danger/badge*/tab*/input*/placeholder/success/warning/info/overlay, dark+light via useColorScheme.
- spacing (4/8/12/16/24/32/48), radii (6/8/12/16/24/pill), typography scale, shadow helper.

## Components (src/components)
- Button (variants primary/secondary/ghost/danger, sizes sm/md/lg, loading, a11y).
- Input (label, error, multiline).
- Card, Badge, EmptyState, SectionHeader, Segmented, ReportCard.

## Screens
- App.tsx: SafeAreaView wrapper.
- Login/Register: hero mark + card form, inline error, keyboard avoiding.
- Dashboard: greeting header + segmented tabs; create: photo CTA card / preview card with image, prediction, location, description, submit + retry; list: ReportCard list or EmptyState or error+retry.
- ErrorBoundary: existing fallback, themed.

## A11y (R54)
- Touch targets >=44px; roles/labels on controls; contrast AA; keyboard persist taps.

## Constraints
- Props/API contracts unchanged. Files <=250 lines (R73). Typecheck green.

## Unverified
- External references (mobbin/dribbble/awwwards) not fetched this session (quota). Pattern derived from MD3 + civic app conventions.