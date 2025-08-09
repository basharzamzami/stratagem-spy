# Design System (Specter Net)

This document outlines tokens, components and patterns for a consistent SaaS UI.

## Tokens
- Colors: defined via CSS variables in src/index.css and Tailwind theme
- Spacing & Radius: --radius, --radius-lg/xl; spacing via Tailwind scale
- Typography: fonts defined in Tailwind config; heading/body scale

## Components
- Primitives: Button, Input, Select, Card, Badge, Tabs, Dialog, Drawer, Sheet
- Feedback: Skeleton, Toast/Sonner, Alert
- Navigation: Sidebar, Breadcrumbs, PageHeader (title/subtitle/actions)
- Data viz: ChartContainer + Recharts

## Patterns
- Sticky FilterBar at top of data pages
- PageHeader + breadcrumbs for context
- Consistent spacing (p-6 cards, page padding p-8)
- Loading skeletons; clear empty/error states

## Theming
- Light/Dark via data-theme; tokens update CSS vars
- Persist preference in localStorage
