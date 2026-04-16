# DESIGN.md — CCSA Project Management Tool
> Inspired by Cal.com design system from `VoltAgent/awesome-design-md`
> Generated for use with AI coding agents (Codex, Claude Code, Cursor, Copilot)

---

## 1. Visual Theme & Atmosphere

This is a **light-first, professional project management interface** for CCSA (Cheetah Chrome South Africa). The aesthetic is clean, structured, and data-dense — inspired by Cal.com's scheduling tool design. Content is presented on a warm near-white canvas (`#fafafa`) with crisp white card surfaces, subtle shadows, and clear typographic hierarchy.

The color system is **semantic-first**: background and text are near-monochrome (white/gray/near-black), while color is reserved exclusively for status and priority signals (blue = in progress, green = done, amber = blocked, red = high priority). This makes status scannable at a glance without visual noise.

Typography uses **Plus Jakarta Sans** — a modern, rounded geometric sans-serif that feels professional yet approachable. It pairs well with Chinese characters (中文) in bilingual UI contexts. Headings are bold and tight-tracked; body text is relaxed and readable.

**Key Characteristics:**
- Light background: `#fafafa` page, `#ffffff` card surfaces
- Semantic color only — no decorative color, color = status
- Plus Jakarta Sans as the primary typeface (bilingual-friendly)
- 8px base border-radius for cards and inputs; 6px for buttons and badges
- Subtle box shadows on cards: `0 1px 3px rgba(0,0,0,0.05)`
- Border system: `#e5e7eb` standard, `#d1d5db` emphasis
- Hover states use `#f3f4f6` background tint — never bold color
- All interactive elements have smooth `0.12s` transitions

---

## 2. Color Palette & Roles

### CSS Custom Properties
```css
:root {
  /* Backgrounds */
  --bg:          #fafafa;   /* Page background */
  --bg-2:        #ffffff;   /* Card / surface background */
  --bg-3:        #f3f4f6;   /* Subtle tint, hover, table header */
  --bg-4:        #e9eaec;   /* Progress track, disabled */

  /* Borders */
  --border:      #e5e7eb;   /* Standard border */
  --border-dark: #d1d5db;   /* Emphasis border, input focus ring */

  /* Text */
  --text-1:      #111827;   /* Primary — headings, key data */
  --text-2:      #374151;   /* Secondary — body, table cells */
  --text-3:      #6b7280;   /* Tertiary — labels, meta, placeholders */
  --text-4:      #9ca3af;   /* Muted — timestamps, section headers, captions */

  /* Brand */
  --brand:       #111827;   /* Primary button, active nav, logo */

  /* Semantic: Blue — In Progress / Primary Action */
  --blue:        #3b82f6;
  --blue-dim:    #eff6ff;
  --blue-border: #bfdbfe;

  /* Semantic: Green — Done / Success */
  --green:       #10b981;
  --green-dim:   #ecfdf5;
  --green-border:#a7f3d0;

  /* Semantic: Amber — Blocked / Warning */
  --amber:       #f59e0b;
  --amber-dim:   #fffbeb;
  --amber-border:#fde68a;

  /* Semantic: Red — Cancelled / Error / High Priority */
  --red:         #ef4444;
  --red-dim:     #fef2f2;
  --red-border:  #fecaca;

  /* Semantic: Purple — In Review / Secondary Status */
  --purple:      #8b5cf6;
  --purple-dim:  #f5f3ff;
  --purple-border:#ddd6fe;
}
```

### Color Usage Rules
| Color | Use for | Never use for |
|-------|---------|---------------|
| `--brand` (#111827) | Primary buttons, active nav, logo | Body text |
| `--blue` | "In Progress" badge, primary action button | Decoration |
| `--green` | "Done" badge, success states, progress bars | Background |
| `--amber` | "Blocked" badge, warning states | Primary actions |
| `--red` | "Cancelled", errors, High priority indicator | General emphasis |
| `--purple` | "In Review" badge | Background fills |
| `--text-3` | Labels, meta, placeholders | Headings |
| `--bg-3` | Table headers, hover backgrounds, subtle sections | Card backgrounds |

---

## 3. Typography

### Font Stack
```css
font-family: 'Plus Jakarta Sans', -apple-system, system-ui,
             'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
```

Load from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

For monospace (dates, IDs, codes):
```css
font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
```

### Type Scale

| Role | Size | Weight | Color | Letter Spacing | Use |
|------|------|--------|-------|----------------|-----|
| Display | 48px | 700 | `--text-1` | -1.5px | Hero headlines |
| Heading 1 | 24px | 700 | `--text-1` | -0.5px | Section titles |
| Heading 2 | 18px | 600 | `--text-1` | -0.3px | Card titles, sidebar headers |
| Heading 3 | 15px | 600 | `--text-1` | -0.1px | Table group headers |
| Body Large | 15px | 400 | `--text-3` | 0 | Descriptions, subtitles |
| Body | 14px | 400 | `--text-2` | 0 | Default reading text |
| Body Medium | 14px | 500 | `--text-2` | 0 | Nav items, labels |
| Small | 13px | 500 | `--text-2` | 0 | Table cells, form helpers |
| Label | 12px | 600 | `--text-3` | 0.01em | Badge text, button small |
| Caption | 11px | 700 | `--text-4` | 0.07em | Section headers (UPPERCASE), column headers |
| Mono | 12px | 400 | `--text-2` | 0 | IDs, dates, code snippets |

### Typography Rules
- All section/column labels: **uppercase + 0.07em tracking + weight 700 + `--text-4`**
- Headings always use `--text-1`, never colored
- Body text default is `--text-2`; secondary info uses `--text-3`
- Chinese characters (中文) render cleanly at all sizes — no special treatment needed
- Line height: headings `1.1`, body `1.6`, compact UI `1.4`

---

## 4. Component Library

### Buttons

```css
/* Base */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  padding: 9px 18px;
  cursor: pointer;
  border: none;
  transition: all 0.12s ease;
  white-space: nowrap;
}

/* Primary (Dark) — default CTA */
.btn-primary {
  background: var(--brand);    /* #111827 */
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.10);
}
.btn-primary:hover { background: #1f2937; }

/* Secondary (Outline) */
.btn-secondary {
  background: #ffffff;
  color: var(--text-1);
  border: 1px solid var(--border-dark);
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.btn-secondary:hover { background: var(--bg-3); }

/* Blue — special actions (deploy, confirm, submit) */
.btn-blue {
  background: var(--blue);
  color: #ffffff;
}
.btn-blue:hover { background: #2563eb; }

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--text-3);
}
.btn-ghost:hover { color: var(--text-1); background: var(--bg-3); }

/* Disabled */
.btn:disabled, .btn[disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Size variants */
.btn-sm { padding: 6px 13px; font-size: 12px; border-radius: 7px; }
.btn-lg { padding: 12px 24px; font-size: 16px; border-radius: 10px; }
```

### Status Badges

Badges always include a colored dot indicator + text. Font-size 12px, weight 600.

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Variants */
.badge-blue   { background: var(--blue-dim);   color: #2563eb; border: 1px solid var(--blue-border); }
.badge-green  { background: var(--green-dim);  color: #059669; border: 1px solid var(--green-border); }
.badge-amber  { background: var(--amber-dim);  color: #d97706; border: 1px solid var(--amber-border); }
.badge-red    { background: var(--red-dim);    color: #dc2626; border: 1px solid var(--red-border); }
.badge-purple { background: var(--purple-dim); color: #7c3aed; border: 1px solid var(--purple-border); }
.badge-gray   { background: var(--bg-3);       color: var(--text-3); border: 1px solid var(--border); }
```

**Status → Badge mapping:**
| Status | Badge variant | Dot color |
|--------|--------------|-----------|
| In Progress / 进行中 | `badge-blue` | `#3b82f6` |
| In Review / 审核中 | `badge-purple` | `#8b5cf6` |
| Done / 完成 | `badge-green` | `#10b981` |
| Blocked / 受阻 | `badge-amber` | `#f59e0b` |
| Not Started / 未开始 | `badge-gray` | `#9ca3af` |
| Cancelled / 取消 | `badge-red` | `#ef4444` |

### Cards

```css
.card {
  background: var(--bg-2);           /* #ffffff */
  border: 1px solid var(--border);   /* #e5e7eb */
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.12s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-color: var(--border-dark);
}
```

### Form Inputs

```css
/* Label */
.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-2);
  margin-bottom: 5px;
}

/* Input / Textarea / Select */
.form-input {
  width: 100%;
  background: var(--bg-2);
  border: 1px solid var(--border-dark);
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 14px;
  font-family: inherit;
  color: var(--text-1);
  outline: none;
  transition: border-color 0.12s, box-shadow 0.12s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

.form-input:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(59,130,246,0.10);
}

.form-input::placeholder {
  color: var(--text-4);
}
```

### Navigation Sidebar

```css
.sidebar {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

.sidebar-section-title {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-4);
  padding: 14px 14px 6px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-3);
  border-radius: 6px;
  margin: 1px 6px;
  cursor: pointer;
  transition: all 0.10s;
  text-decoration: none;
}

.sidebar-item:hover {
  background: var(--bg-3);
  color: var(--text-1);
}

/* Active state: dark fill */
.sidebar-item.active {
  background: var(--brand);   /* #111827 */
  color: #ffffff;
}

.sidebar-item-count {
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-4);
  background: var(--bg-3);
  padding: 1px 7px;
  border-radius: 20px;
}

/* Active item count */
.sidebar-item.active .sidebar-item-count {
  background: rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.7);
}
```

### Data Table

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table thead th {
  text-align: left;
  padding: 10px 16px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-4);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border);
  background: var(--bg-3);
}

.data-table tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.10s;
}

.data-table tbody tr:hover {
  background: var(--bg-3);
}

.data-table tbody tr:last-child {
  border-bottom: none;
}

.data-table td {
  padding: 10px 16px;
  color: var(--text-2);
  vertical-align: middle;
}

.data-table td:first-child {
  color: var(--text-1);
  font-weight: 500;
}
```

### Progress Bars

```css
.progress-track {
  height: 6px;
  background: var(--bg-4);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.4s ease;
}

/* Color by context */
.progress-fill.blue   { background: var(--blue); }
.progress-fill.green  { background: var(--green); }
.progress-fill.amber  { background: var(--amber); }
.progress-fill.red    { background: var(--red); }
```

### Gantt / Timeline Bars

```css
/* Container row */
.gantt-row {
  display: flex;
  border-bottom: 1px solid var(--border);
  transition: background 0.10s;
  min-height: 36px;
}
.gantt-row:hover { background: var(--bg-3); }

/* Group header row */
.gantt-row.group {
  background: var(--bg-3);
}

/* Left label cell */
.gantt-label {
  width: 220px;
  flex-shrink: 0;
  padding: 8px 16px;
  border-right: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-2);
}

/* Group label */
.gantt-label.group-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-3);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

/* Timeline area */
.gantt-timeline {
  flex: 1;
  position: relative;
  min-height: 36px;
}

/* Task bars */
.gantt-bar {
  position: absolute;
  height: 20px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 0 9px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
}

/* Bar variants */
.gantt-bar.in-progress {
  background: var(--blue);
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(59,130,246,0.30);
}

.gantt-bar.not-started {
  background: var(--bg-4);
  color: var(--text-3);
  border: 1px solid var(--border-dark);
}

.gantt-bar.done {
  background: var(--green-dim);
  color: #059669;
  border: 1px solid var(--green-border);
}

.gantt-bar.blocked {
  background: var(--amber-dim);
  color: #d97706;
  border: 1px solid var(--amber-border);
}

/* Milestone diamond */
.gantt-milestone {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--brand);
  transform: translateY(-50%) rotate(45deg);
  top: 50%;
  border-radius: 2px;
}
```

### Stat Cards

```css
.stat-card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 18px 20px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-3);
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.8px;
  line-height: 1;
  color: var(--text-1);
}

.stat-delta {
  font-size: 12px;
  font-weight: 500;
  margin-top: 6px;
}

.stat-delta.up   { color: var(--green); }
.stat-delta.down { color: var(--red); }
```

### Top Navigation Bar

```css
.topbar {
  height: 52px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.topbar-logo {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-1);
  letter-spacing: -0.3px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.topbar-logo-icon {
  width: 26px;
  height: 26px;
  background: var(--brand);
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
}

.topbar-nav a {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-3);
  padding: 5px 12px;
  border-radius: 7px;
  text-decoration: none;
  transition: all 0.10s;
}

.topbar-nav a:hover  { color: var(--text-1); background: var(--bg-3); }
.topbar-nav a.active { color: var(--text-1); background: var(--bg-3); }
```

---

## 5. Spacing & Layout

```css
/* Base spacing unit: 4px */
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

**Page layout:**
- Max content width: `880px` centered
- Page padding: `56px 40px` (top/bottom, left/right)
- Section gap: `52px` between major sections
- Card internal padding: `20px`
- Table cell padding: `10px 16px`

**Border radius scale:**
- Micro (badges): `6px`
- Small (buttons): `7–8px`
- Medium (inputs, cards): `8–12px`
- Large (modals): `14–16px`

---

## 6. Shadows

```css
/* Card (default) */
box-shadow: 0 1px 3px rgba(0,0,0,0.05);

/* Card (hover) */
box-shadow: 0 4px 12px rgba(0,0,0,0.08);

/* Dropdown / popover */
box-shadow: 0 8px 24px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06);

/* Input (default) */
box-shadow: 0 1px 2px rgba(0,0,0,0.04);

/* Input (focus ring) — blue */
box-shadow: 0 0 0 3px rgba(59,130,246,0.10);

/* Button primary */
box-shadow: 0 1px 2px rgba(0,0,0,0.10);

/* Gantt bar (in progress) */
box-shadow: 0 2px 6px rgba(59,130,246,0.30);
```

---

## 7. Motion & Transitions

All transitions use `ease` timing (not `linear`):

```css
/* Default interactive */
transition: all 0.12s ease;

/* Navigation items (faster) */
transition: all 0.10s ease;

/* Progress bars (slower, visual impact) */
transition: width 0.40s ease;

/* Card hover (gentle) */
transition: box-shadow 0.12s ease, border-color 0.12s ease;
```

**Principles:**
- No animation on page load — content appears immediately
- Hover states only, no click animations
- Never use `transform: scale()` for hover — use shadow/border changes instead

---

## 8. Bilingual (中英文) Guidelines

This UI is bilingual: Chinese primary, English secondary (or mixed).

**Text rendering:**
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

**Mixed language patterns (approved):**
```
斜井 1 特殊支护                    ← Chinese only label
斜井 2 特殊支护 / Decline 2 Support ← Chinese / English slash format
TMM Project · 隧道机械化项目        ← English · Chinese dot format
In Progress  进行中                 ← Status badge: English, tooltip: Chinese
```

**Font fallback for Chinese:**
```css
font-family: 'Plus Jakarta Sans', 'PingFang SC', 'Microsoft YaHei',
             'Noto Sans SC', system-ui, sans-serif;
```

**Layout rules for bilingual:**
- Chinese text: slightly tighter line-height (`1.5`) than English (`1.6`)
- Mixed lines: use English line-height (`1.6`) to avoid CJK clipping
- Section labels (uppercase): English only — uppercase Chinese is not used
- Table column headers: English preferred; Chinese in parentheses if needed

---

## 9. Do's and Don'ts

### ✅ Do
- Use `--bg-3` (#f3f4f6) for table headers, group rows, hover backgrounds
- Use semantic color (blue/green/amber/red) only for status and priority
- Use `font-weight: 700` + uppercase + `letter-spacing: 0.07em` for all section/column labels
- Keep card `border-radius: 12px`, button `border-radius: 8px`, badge `border-radius: 6px`
- Use `box-shadow: 0 0 0 3px rgba(59,130,246,0.10)` for all focused inputs
- Add `transition: all 0.12s ease` to all interactive elements
- Use `--text-4` (#9ca3af) for section titles, timestamps, column headers

### ❌ Don't
- Don't use color as decoration — only as status signal
- Don't use dark backgrounds (this is a light-mode design)
- Don't use `border-radius > 12px` on cards or containers
- Don't mix font weights randomly — stick to 400/500/600/700 only
- Don't use colored backgrounds on cards — always `#ffffff`
- Don't omit the dot indicator in badges
- Don't use `transition: all` on non-interactive elements
- Don't use `text-transform: uppercase` on body text or headings
- Don't use Inter, Roboto, or Arial — use Plus Jakarta Sans
- Don't add drop shadows heavier than `0 4px 12px rgba(0,0,0,0.08)`

---

## 10. Quick Reference — Status System

| Status | EN Label | CN Label | Badge Class | Bar Class | Priority Color |
|--------|----------|----------|-------------|-----------|----------------|
| In Progress | In Progress | 进行中 | `badge-blue` | `gantt-bar in-progress` | — |
| In Review | In Review | 审核中 | `badge-purple` | `gantt-bar in-progress` | — |
| Done | Done | 已完成 | `badge-green` | `gantt-bar done` | — |
| Blocked | Blocked | 受阻 | `badge-amber` | `gantt-bar blocked` | `--amber` |
| Not Started | Not Started | 未开始 | `badge-gray` | `gantt-bar not-started` | — |
| Cancelled | Cancelled | 已取消 | `badge-red` | — | — |
| High Priority | High | 高优先级 | — | — | `--red` ↑ |
| Medium Priority | Medium | 中优先级 | — | — | `--amber` → |
| Low Priority | Low | 低优先级 | — | — | `--text-4` ↓ |
| Milestone | Milestone | 里程碑 | — | `gantt-milestone` | `--brand` |
