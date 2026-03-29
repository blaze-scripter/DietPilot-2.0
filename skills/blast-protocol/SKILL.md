---
name: blast-protocol
description: Governs HOW every task is executed in this project using the B.L.A.S.T protocol (Blueprint, Link, Architect, Stylize, Trigger). Make sure to ALWAYS use this skill when starting any new task, feature request, or command, to ensure Protocol 0 memory updates are strictly followed and the task is converted into a BLAST directive. Do not execute any casual prompt without first triggering this skill.
---

# B.L.A.S.T. Protocol

> Governs HOW every task is executed in this project.
> gemini.md is still THE LAW. This file is the execution framework.
> Works alongside AGENTS.md — does not replace it.

---

## The 5 Phases

```
B — Blueprint   → Plan before building
L — Link        → Verify connections before using them  
A — Architect   → Build in the right order
S — Stylize     → Improve visuals without breaking logic
T — Trigger     → Deploy and confirm it works
```

---

## 🟢 Protocol 0 — Always runs first

Update memory files before touching any code:

- `gemini.md`    → only if a rule, schema, or stack changes
- `task_plan.md` → add the new task as a checklist item
- `progress.md`  → log that this task has started
- `findings.md`  → log any research or API discoveries

**HALT until the user approves the plan.**

---

## 🏗️ B — Blueprint

Answer these before writing anything:

1. **North Star** — what is the single desired outcome?
2. **Integrations** — which external services are needed?
3. **Source of Truth** — where does the data live?
4. **Delivery** — where should the result end up?
5. **Rules** — any constraints or "Do Not" rules?

Define input/output data shapes in `gemini.md` first.
No code until the blueprint is approved.

---

## ⚡ L — Link

1. Add required keys to `.env`
2. Write a minimal test script in `execution/` for each API
3. Confirm 200 OK and sample data
4. Log results in `progress.md`

**Do not proceed to Architect if any link is broken.**

---

## ⚙️ A — Architect

1. Write the SOP in `directives/` before writing code
2. Write deterministic scripts in `execution/`
3. Use `.tmp/` for all intermediate files
4. Push to GitHub when done

**If logic changes → update the SOP before the code.**

---

## ✨ S — Stylize

RESKIN ONLY — never break working functionality.

Before touching any file:
- Read the whole file first
- Only change classNames and layout
- Never delete onClick, onChange, useEffect, or API calls
- Apply Design System Law from `gemini.md` exactly

---

## 🛰️ T — Trigger

1. Run final smoke tests
2. Push to GitHub with a descriptive commit message
3. Deploy frontend and backend
4. Confirm live URLs work
5. Update `progress.md` with completion summary

---

## Auto-Conversion Rule

Never execute a casual prompt directly.
Always convert it first and show the user before running:

```
🚨 B.L.A.S.T. DIRECTIVE: [TASK NAME] 🚨

🟢 PROTOCOL 0 — MEMORY UPDATE
- gemini.md:     [what changes, if anything]
- task_plan.md:  [new checklist item]
- progress.md:   [log task as started]

📋 DATA SCHEMA
- Input:   [what goes in]
- Output:  [what comes out]
- Storage: [where it lives]

⚡ PHASE [X] — [PHASE NAME]
1. [Step]
2. [Step]
3. [Step]

✅ VERIFICATION
- Test:               [how to verify]
- Success looks like: [expected result]
- Log in progress.md: [what to record]

HALT and show results before next phase.
```

---

## HALT Rules

Stop and wait for user approval:
- After Protocol 0 (before any coding)
- After Link phase (before building)
- After Architect phase (before UI work)
- After Stylize phase (before deploying)
- After any error that cannot be self-healed
