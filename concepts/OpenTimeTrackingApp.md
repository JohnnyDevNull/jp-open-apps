# Open Time Tracker — Architecture & MVP Plan

## Introduction
An ultra-focused personal time tracking app that excels at one thing: recording time entries efficiently. Each entry has date, startAtUtc, endAtUtc, a required category, and optional project, tag, and note. Designed for individuals first, usable by freelancers and small teams later. Data stays raw; rounding applies only to views/exports.

## Architecture Overview
- Frontend (PWA): React-based SPA for time capture, lists, and CSV import/export.
- Backend (optional for MVP): Start with an online-only app and local state management; add an API later for sync, persistence, auth, and teams.
- Persistence (MVP): Local Storage/IndexedDB; future: server-side database.
- Timezone Handling: Store in UTC, display using user-configured IANA timezone.

## Domain Model (MVP)
- Category: name (unique per user), plain text (A–Z, a–z, 0–9, space, - _), length 2–50.
- Project: name (unique per user), same constraints, length 2–80.
- Tag: name (unique per user), same constraints, length 2–30.
- TimeEntry:
  - id
  - startAtUtc (ISO-8601)
  - endAtUtc (ISO-8601)
  - durationSeconds (computed)
  - categoryId (required)
  - projectId (optional)
  - tags (N:M via join)
  - note (<= 2000)
  - createdAt/updatedAt
- Settings:
  - roundingMinutes: {0,5,10,15,30,60}
  - roundingMode: {up, nearest}
  - roundingScope: per-total (default)
  - userTimeZone: IANA name (e.g., Europe/Berlin)

## Constraints & Validation
- No overlapping TimeEntries (checked in UTC).
- startAtUtc < endAtUtc; durationSeconds > 0; max duration 24h.
- Unique names per user for Category/Project/Tag (case-insensitive).
- Max per user: 1000 categories, 1000 projects, 1000 tags.
- Max tags per TimeEntry: 10.
- Delete policy:
  - Category/Project deletion requires reassignment wizard; otherwise allow archiving (archived=true).
  - Tag rename allowed; tag delete requires reassignment or soft-archive.

## Key Flows (MVP)
- Timer Mode:
  - Pre-fill required Category; optional Project/Tag/Note.
  - Exactly one active timer in UI; Pause/Resume supported; Stop finalizes entry.
- Manual Entry:
  - Form with date, startLocal, endLocal, Category, optional Project/Tag/Note.
  - Convert to UTC on save; enforce constraints.
- Edit/Delete:
  - Full edit of all fields; re-run overlap validation.
  - Delete with confirmation.
- CSV Import/Export:
  - Export: UTF-8, comma, header, ISO-8601 UTC times; includes raw durationSeconds and rounded totals.
  - Import: Validate schema; quick-create Category/Project/Tag if missing; simple duplicate detection using (startAtUtc, endAtUtc, categoryId, projectId, tag, noteHash).
- Rounding:
  - Only for lists, summaries, and exports; never mutates stored data.

## UI Overview (MVP)
- Today View: active timer widget, quick-add, list of today’s entries (rounded display + raw on hover).
- Calendar Tabs: Daily / Weekly / Monthly lists with totals (rounded per-total).
- Manage Data: Categories, Projects, Tags (create, rename, archive; delete via reassignment).
- Settings: Timezone, rounding options, CSV import/export.
- Search/Filter: By date range, category, project, tag, text-in-note.

## Non-Functional Requirements
Open questions / decisions needed:
- Performance targets:
  - Expected max entries per day and total history size (e.g., 50/day, 100k total)?
  - Target load time for day/week/month views and search (e.g., <200ms after data cached)?
  - Is list virtualization acceptable for large datasets?
- Accessibility (a11y):
  - Target level (WCAG 2.1 AA)? Keyboard-only navigation required? Screen reader support priority?
  - Preferred focus order and shortcuts for primary actions (start/stop/pause, save)?
- Internationalization:
  - Initial languages? Is English UI sufficient for MVP?
  - 24h vs 12h time format; first day of week (Mon/Sun); locale number/date formats?
- Privacy & Security:
  - Local data: require encryption-at-rest (IndexedDB/LocalStorage) or plain acceptable for MVP?
  - Optional app passcode/lock screen needed?
  - Data retention policy (keep indefinitely until user deletes)?
- Backups:
  - Manual export only, or add optional reminders (e.g., weekly “backup now”)?
  - Any need for password-protected export archives?
- Telemetry:
  - Allow anonymous error reporting/crash logs? Usage analytics enabled/disabled by default?
- Compliance (future backend):
  - DSGVO expectations (data portability/export, delete account flow)?
  - Data residency preferences (EU-only) for future sync?

## CSV Specification
Open questions / decisions needed:
- Columns (Export/Import):
  - id, startAtUtc, endAtUtc, durationSeconds, categoryName, projectName, tagName, note
  - Include a derived date column (UTC date or user-local date)? Needed for spreadsheets?
- Formats:
  - Delimiter (comma), quote char ("), escape ("") — confirm; newline (\n); encoding UTF-8 with header row?
  - Include BOM for Excel compatibility, or omit?
- Duplicate detection on import:
  - Default key: (startAtUtc, endAtUtc, categoryName, projectName, tagName, noteHash) — confirm.
  - Behavior on duplicates: skip, merge/update, or import duplicate? Default: skip with report — confirm.
- Quick-create on import:
  - Auto-create missing Category/Project/Tag using normalization (trim/collapse spaces, case-insensitive uniqueness) — confirm.
  - What to do if names violate charset/length rules: reject row or auto-sanitize (and how)?
- Limits & UX:
  - Max file size and max rows per import (e.g., 5 MB / 50k rows)?
  - Partial import behavior on errors: stop-all, or continue and produce error report?
- Rounding in CSV:
  - Include both raw durationSeconds and an additional roundedDurationSeconds column (based on current settings)? Needed?

## Validation Matrix
Open questions / decisions needed:
- Name fields (Category/Project/Tag):
  - Confirm allowed charset: letters, digits, space, dash, underscore; no emojis/specials.
  - Case-insensitive uniqueness per user; normalize (trim, collapse multiple spaces) on save — confirm.
  - Behavior on length violations (Category 2–50, Project 2–80, Tag 2–30): block with error vs auto-truncate?
  - Reserved names (e.g., “Uncategorized”)? Needed?
- TimeEntry:
  - Max duration 24h — on violation, block or suggest split?
  - Overlap validation in UTC across midnight — on violation: block with guidance vs auto-adjust suggestions?
  - Are entries spanning midnight kept as single entry or auto-split (future option)?
- Tags:
  - Max tags per entry: 10 — confirm behavior when limit exceeded in UI/import.
  - Rename rules: propagate to all entries immediately; any audit trail needed?
- Deletion/Reassignment:
  - For Category/Project deletion: must pick target for reassignment; what’s the default target (none vs last used)?
  - If reassignment cancelled: keep entity archived or leave as-is?

## Settings Defaults
Open questions / decisions needed:
- Timezone:
  - Default to browser-detected IANA timezone on first run, then fixed in settings — confirm.
  - Week start (Mon/Sun) and 24h clock default?
- Rounding:
  - Default roundingMinutes = 0 (off) and roundingMode = nearest — confirm.
  - Scope default per-total; allow user to switch to per-entry in UI later?
- Lists & Views:
  - Default landing view (Today vs Week)? Default date range persistence across sessions?
  - Show raw duration on hover/detail by default — confirm.
- Timer:
  - One active timer enforced in UI (no API enforcement) — confirm any warning text.
  - Pause behavior: store as a single entry with excluded pause intervals, or multiple segments collapsed on stop (preferred?) — confirm.

## Error and Edge-Case Handling
Open questions / decisions needed:
- Overlap conflicts:
  - Exact user message; offer “Adjust end to previous start” quick action, or block only?
  - Should manual entries be auto-snapped to nearest 5 minutes (optional UX) — yes/no?
- Timer edge cases:
  - Timer across midnight: keep single entry or suggest split on stop?
  - App/browser closed during active timer: resume from last persisted start or discard?
- Pause semantics:
  - Represent pauses as internal segments (not stored individually) and compute duration excluding pauses — confirm.
- Import conflicts:
  - Duplicate rows: default action (skip with report); where to show/download the report?
  - Fuzzy duplicates (same startAtUtc/endAtUtc but different note): treat as new or duplicate?
- Deletion safety:
  - Confirm dialogs text; bulk delete allowed? Soft-delete needed or hard delete is fine?

## UI Flows Overview
Open questions / decisions needed:
- Timer:
  - Required pre-fill of Category before Start; optional Project/Tag/Note inline — confirm.
  - Controls: Start/Stop/ Pause/Resume layout; live elapsed time display style.
  - Keyboard shortcuts: propose S (start/stop), P (pause/resume), A (add manual), E (edit) — confirm/change.
- Manual entry:
  - Defaulting behavior (pre-fill last used Category/Project/Tag); time pickers format (HH:mm 24h).
  - Inline form vs modal dialog; quick-create for Category/Project/Tag in-place.
- Edit/List:
  - Inline edit vs dedicated edit page; multi-select delete; undo toast after delete?
  - Filters persistence and quick presets (Today, This Week, This Month).
- Manage Data:
  - List with counts per entity; rename inline; archive/unarchive visibility toggles.
- Settings:
  - Preview of rounding/timezone effects; import/export placement and confirmations.

## Milestones & Acceptance Criteria (MVP)
Open questions / decisions needed:
- Scope freeze for MVP:
  - Exact feature checklist to be considered “done” (Timer with Pause, Manual CRUD, Overlap prevention, Manage Data, Settings, CSV Import/Export, Rounding in views/exports) — confirm.
- Quality gates:
  - Performance targets for lists/search; acceptable initial load time; minimal offline resilience (local state).
  - Accessibility baseline (keyboard navigation, labels).
- Data integrity:
  - Validation rules fully enforced (charset, lengths, uniqueness, overlaps); reassignment flows implemented.
- CSV:
  - Export/import parity; duplicate handling; error reporting format.
- Acceptance demo:
  - Which end-to-end scenarios must pass (e.g., create categories, run a timer, edit entry, import CSV with duplicates, export period)?
- Timeline & priorities:
  - Desired MVP deadline; must-have vs nice-to-have within MVP.

## Collaboration Notes (Session Summary)
- Roles:
  - You: Stakeholder/idea owner.
  - Me: Product Manager, Software Architect, and Tech Lead for scoping and design.
- Language:
  - the conversation is in German.
  - the document is in English.
- Vision:
  - Ultra-focused personal time tracker centered on fast, accurate time entry.
- MVP scope decisions:
  - One active timer enforced in UI; Pause/Resume allowed; Stop finalizes entry.
  - Manual entry with validation (start < end), no overlapping entries (strict in UTC).
  - Required: Category; Optional: Project, Tag(s) via catalog, Note (<= 2000 chars).
  - Rounding only for display/exports (minutes: 0,5,10,15,30,60; mode: up|nearest; scope default: per-total). Raw data stays untouched.
  - CSV export/import required; simple duplicate detection on import.
  - Storage: startAtUtc, endAtUtc, durationSeconds (computed), UTC-only; display using user-configured timezone.
- Data model highlights:
  - Category/Project/Tag: plain text, unique per user (case-insensitive), allowed charset [A–Z a–z 0–9 space - _].
  - Tags: catalog entity with N:M (TimeEntryTag); quick-create and rename supported; delete requires reassignment or soft-archive.
  - Limits: 10 tags per entry; 1000 Categories/Projects/Tags per user; max entry duration 24h.
  - Delete policy: Category/Project deletion requires reassignment; otherwise archive (archived=true).
- Non-goals (MVP):
  - No backend, auth, rates/billing, or advanced reporting in MVP; local persistence only (Local Storage/IndexedDB).
- Next session pointers:
  - Fill open questions in: Non-Functional Requirements, CSV Specification, Validation Matrix, Settings Defaults, Error/Edge Cases, UI Flows, Milestones & Acceptance Criteria.

## Sequence Diagram (PlantUML)

tbd;

## Deployment (MVP)
- Web app served statically.
- Local Storage/IndexedDB for persistence.
- No authentication; no backend dependency.

## Roadmap
1) Short-term:
- Server API for sync and backups
- User accounts and authentication
- Role-based spaces (teams)
- Better reports (sums per category/project)
2) Mid-term:
- Mobile PWA enhancements, offline sync
- Advanced import rules, conflict resolution
- Integrations (calendar, task tools)
3) Long-term:
- Billing rates, invoices
- Public API and webhooks
- Multi-tenant SaaS

### Pre-Prompt

Das Dokument selbst soll in Englisch entstehen während wir beide auf Deutsch reden.
Ich nehme die Rolle des Stacke-Holders ein, der die Idee hat und du die Rolle des Product Managers, Software Architect und Tech-Lead, der mich jetzt so lange mit Fragen löchert bis wir einen sehr guten Plan haben.
