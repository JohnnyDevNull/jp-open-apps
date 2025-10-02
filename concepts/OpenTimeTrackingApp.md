# Open Time Tracker — MVP Specification (Clean v2)


## Introduction
An ultra-focused personal time tracking app that excels at one thing: recording time entries efficiently. Each entry has date, startAtUtc, endAtUtc, a required category, and optional project, tag, and note. Designed for individuals first, usable by freelancers and small teams later. Data stays raw; rounding applies only to views/exports.

## MVP Scope & Goals
### Scope Freeze (MVP Features)
- **Timer with Pause/Resume**, with auto-split across midnight.
- **Manual CRUD entries** (Create, Edit, Delete) with validation and overlap checking.
- **Category required**, Project/Tags optional, Notes ≤2000 chars.
- **Manage Data:** Create, rename, archive or delete Category/Project/Tag (with reassignment wizard for Category/Project; hard delete for Tags).
- **CSV Import/Export:**
  - Export includes `dateLocal` and `roundedDurationSeconds`.
  - Import with duplicate detection (skip + error report), quick-create for missing entities, reject rows with rule violations.
- **Rounding:** Only for views/exports, never mutates stored data.
- **Settings:** Timezone, week start, 24h-only, rounding options.

### Quality Gates
- **Performance:** Today ≤150ms, Week/Month ≤250ms (after cache).
- **Accessibility:** WCAG 2.1 AA, full keyboard navigation, baseline screenreader support.
- **Offline resilience:** IndexedDB/LocalStorage only, works without network.

### Data Integrity
- Validation: start < end, ≤24h, no overlaps, max 10 tags.
- Delete policies: Category/Project → reassignment wizard + hard delete; Tag → hard delete after confirmation.
- Data model consistent: entries stored only in UTC, duration computed, raw data never mutated.

### CSV Parity
- Export/import field parity guaranteed.
- Duplicates skipped with downloadable CSV report.
- Errors reported at row-level; import continues.

### Acceptance Demo Scenarios
- Create categories, start/pause/stop timer (with midnight split).
- Create manual entry with overlap error + quick action fix.
- Export CSV with `dateLocal` and `roundedDurationSeconds`.
- Import CSV with duplicates + error report.
- Delete Category with reassignment → hard delete.
- Delete Tag with confirmation → removed everywhere.

### Timeline & Priorities
- MVP deadline: TBD (depends on team capacity).
- Must-haves: all above features.
- Nice-to-haves: backup reminder, archive toggle, multi-language (German).

---

### Collaboration Notes (Context)
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

## Architecture & Data Model (MVP)
- Frontend (PWA): React-based SPA for time capture, lists, and CSV import/export.
- Backend (optional for MVP): Start with an online-only app and local state management; add an API later for sync, persistence, auth, and teams.
- Persistence (MVP): Local Storage/IndexedDB; future: server-side database.
- Timezone Handling: Store in UTC, display using user-configured IANA timezone.

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

## Validation & Business Rules
- No overlapping TimeEntries (checked in UTC).
- startAtUtc < endAtUtc; durationSeconds > 0; max duration 24h.
- Unique names per user for Category/Project/Tag (case-insensitive).
- Max per user: 1000 categories, 1000 projects, 1000 tags.
- Max tags per TimeEntry: 10.
- Delete policy:
  - Category/Project deletion requires reassignment wizard; **after reassignment the entity is fully deleted** (not archived). Archiving remains available as a separate, explicit action.
  - Tag rename allowed; **Tag delete performs a hard delete after an irreversible confirmation** (removes the tag from all entries and deletes the tag entity).

### Name fields (Category/Project/Tag)
- **Allowed charset:** `[A–Z a–z 0–9 space - _]`.
- **Normalization:** trim; collapse multiple spaces to one; compare **case-insensitive**.
- **Uniqueness:** case-insensitive unique per user; on conflict, block with actionable hint.
- **Lengths:** Category **2–50**, Project **2–80**, Tag **2–30** → violations **block** (no auto-truncate).
- **Reserved names:** none in MVP (no implicit “Uncategorized”).

### TimeEntry
- Must satisfy: `startAtUtc < endAtUtc`, `durationSeconds > 0`, **max 24h** → violations **block**.
- **Overlap validation:** no overlapping entries (checked in UTC, incl. across midnight). On conflict show **Quick Actions**:
  - “Adjust end to previous start” (auto-fix endAtUtc)
  - “Open conflicting entry” to edit
- **Cross-midnight entries:** **Auto-split at midnight** on save/stop into two entries (no setting needed in MVP). Future option to toggle behavior.
- **>24h spans:** block and offer “Split” dialog across days.

### Tags
- **Max tags per entry:** 10 → UI blocks adding #11; import marks row as error.
- **Rename:** propagates immediately to all entries; no audit trail in MVP.
- **Delete:** **hard delete after irreversible confirmation** → removes tag from all entries and deletes the tag entity (no soft-archive/reassignment).

### Deletion/Reassignment
- **Category/Project delete:** requires **Reassignment Wizard**; after reassignment, the entity is **fully deleted** (not archived). Separate action allows archiving when desired.
- **Data integrity on delete:** all affected TimeEntries are updated atomically; failures roll back and show an actionable error.

### Error messaging (UX)
- Inline, specific, and keyboard-first:
  - “Category name must be 2–50 chars and use A–Z, 0–9, space, - or _.”
  - “Entry overlaps with 2025-10-02 08:00–09:30. Click to adjust.”
- Focus moves to the offending field; **Enter** confirms suggested fix; **Esc** dismisses banners.

Open questions / decisions needed:
- Overlap conflicts:
  - Exact user message; offer “Adjust end to previous start” quick action, or block only?
  - Should manual entries be auto-snapped to nearest 5 minutes (optional UX) — yes/no?
- Timer edge cases:
  - Timer across midnight: **auto-split at midnight on stop/save** (creates two entries, before and after 00:00).
  - App/browser closed during active timer: resume from last persisted start or discard?
- Pause semantics:
  - Represent pauses as internal segments (not stored individually) and compute duration excluding pauses — confirm.
- Import conflicts:
  - Duplicate rows: default action (skip with report); where to show/download the report?
  - Fuzzy duplicates (same startAtUtc/endAtUtc but different note): treat as new or duplicate?
- Deletion safety:
  - Confirm dialogs text; bulk delete allowed. **No Undo-Toast** — once deleted, data is permanently removed. Hard delete only.

## User Flows & UI Design
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

- Today View: active timer widget, quick-add, list of today’s entries (rounded display + raw on hover).
- Calendar Tabs: Daily / Weekly / Monthly lists with totals (rounded per-total).
- Manage Data: Categories, Projects, Tags (create, rename, archive; delete via reassignment).
- Settings: Timezone, rounding options, CSV import/export.
- Search/Filter: By date range, category, project, tag, text-in-note.

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

### Default Settings
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

## CSV Import/Export
### Columns (Export & Import)
- **Standard:** `id, startAtUtc, endAtUtc, durationSeconds, categoryName, projectName, tagName, note`
- **Additional:** `dateLocal` (derived from user’s timezone for spreadsheets), `roundedDurationSeconds` (derived by current rounding settings; data remains raw).

### Formats
- **Delimiter:** `,`
- **Quote:** `"` with escape `""`
- **Newline:** `
`
- **Encoding:** UTF-8 with header row
- **BOM:** included (for Excel compatibility)

### Duplicate Detection (Import)
- **Key:** `(startAtUtc, endAtUtc, categoryName, projectName, tagName, noteHash)`
- **Default behavior:** **skip with report** (downloadable CSV of skipped/errored rows)
- **No merge/update** logic in MVP

### Quick-Create on Import
- Auto-create missing **Category/Project/Tag** with normalization (trim, collapse spaces, case-insensitive uniqueness)
- Violations of charset/length rules → **reject row**; listed in error report (no auto-sanitize in MVP)

### Limits & UX
- **Max file size:** 5 MB
- **Max rows:** 50,000
- **Partial import:** continue on errors and produce an **error report**; no stop-all behavior

## Non-Functional Requirements
### Performance
- Expected max entries per day: 50; max history per user: 100k entries.
- Target load times: Daily ≤150ms, Weekly/Monthly ≤250ms (after cache).
- Virtualized lists enabled if >200 visible rows.
- IndexedDB queries with indices (startAtUtc, endAtUtc, categoryId).

### Accessibility (a11y)
- Target WCAG 2.1 AA compliance.
- Full keyboard navigation with defined focus order.
- Screen reader support with ARIA live regions.
- Keyboard shortcuts: S (start/stop), P (pause/resume), A (add manual), E (edit).

### Internationalization
- MVP UI in English; German planned next.
- Default 24h time format only; **no option to switch**.
- Default week start: Monday; configurable.
- Locale-based date/number formats, displayed in user’s timezone.

### Privacy & Security (MVP)
- Data stored locally in IndexedDB, without encryption-at-rest.
- No app passcode/lock screen in MVP.
- Retention: data kept indefinitely until deleted by user.

### Backups
- Manual CSV export anytime.
- Optional weekly reminder (“backup now”).
- No password-protected archives in MVP.

### Telemetry
- No crash/error reporting in MVP; future: Sentry adapter.
- No usage analytics in MVP; planned for later.

### Compliance (future backend)
- GDPR: data export, delete account flow.
- EU-only data residency for future sync.

---

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

## Deployment (MVP)
- Web app served statically.
- Local Storage/IndexedDB for persistence.
- No authentication; no backend dependency.

## Acceptance Checklist
- MVP Scope features implemented
- Performance and accessibility gates met
- Data integrity rules enforced
- CSV parity and error reporting validated
- Demo scenarios pass end-to-end

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

## Appendix: Sequence Diagram (PlantUML)
tbd;
