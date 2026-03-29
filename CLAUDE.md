# Agent Instructions

> This file is mirrored across CLAUDE.md, AGENTS.md, and GEMINI.md so the same instructions load in any AI environment.

You operate within a 3-layer architecture that separates concerns to maximize reliability. LLMs are probabilistic, whereas most business logic is deterministic and requires consistency. This system fixes that mismatch.

## The 3-Layer Architecture

**Layer 1: Directive (What to do)**  
- Basically just SOPs written in Markdown, live in `directives/`  
- Define the goals, inputs, tools/scripts to use, outputs, and edge cases  
- Natural language instructions, like you'd give a mid-level employee

**Layer 2: Orchestration (Decision making)**  
- This is you. Your job: intelligent routing.  
- Read directives, call execution tools in the right order, handle errors, ask for clarification, update directives with learnings  
- You're the glue between intent and execution. E.g you don't try scraping websites yourself—you read `directives/scrape_website.md` and come up with inputs/outputs and then run `execution/scrape_single_site.py`

**Layer 3: Execution (Doing the work)**  
- Deterministic Python scripts in `execution/`  
- Environment variables, api tokens, etc are stored in `.env`  
- Handle API calls, data processing, file operations, database interactions  
- Reliable, testable, fast. Use scripts instead of manual work. Commented well.

**Why this works:** if you do everything yourself, errors compound. 90% accuracy per step = 59% success over 5 steps. The solution is push complexity into deterministic code. That way you just focus on decision-making.

## Operating Principles

**1. Check for tools first**  
Before writing a script, check `execution/` per your directive. Only create new scripts if none exist.

**2. Self-anneal when things break**  
- Read error message and stack trace  
- Fix the script and test it again (unless it uses paid tokens/credits/etc—in which case you check w user first)  
- Update the directive with what you learned (API limits, timing, edge cases)  
- Example: you hit an API rate limit → you then look into API → find a batch endpoint that would fix → rewrite script to accommodate → test → update directive.

**3. Update directives as you learn**  
Directives are living documents. When you discover API constraints, better approaches, common errors, or timing expectations—update the directive. But don't create or overwrite directives without asking unless explicitly told to. Directives are your instruction set and must be preserved (and improved upon over time, not extemporaneously used and then discarded).

## Self-annealing loop

Errors are learning opportunities. When something breaks:  
1. Fix it  
2. Update the tool  
3. Test tool, make sure it works  
4. Update directive to include new flow  
5. System is now stronger

## File Organization

**Deliverables vs Intermediates:**  
- **Deliverables**: Google Sheets, Google Slides, or other cloud-based outputs that the user can access  
- **Intermediates**: Temporary files needed during processing

**Directory structure:**  
- `.tmp/` - All intermediate files (dossiers, scraped data, temp exports). Never commit, always regenerated.  
- `execution/` - Python scripts (the deterministic tools)  
- `directives/` - SOPs in Markdown (the instruction set)  
- `.env` - Environment variables and API keys  
- `credentials.json`, `token.json` - Google OAuth credentials (required files, in `.gitignore`)

**Key principle:** Local files are only for processing. Deliverables live in cloud services (Google Sheets, Slides, etc.) where the user can access them. Everything in `.tmp/` can be deleted and regenerated.

---

## Agent Teams

> Coordinate multiple Claude Code instances working together as a team with shared tasks, inter-agent messaging, and centralized management.

### Prerequisites

- Claude Code ≥ v2.1.32 (current: v2.1.83 ✅)
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` enabled in `~/.claude/settings.json` ✅
- `teammateMode` set to `in-process` (default for Windows, no tmux needed) ✅

### When to Use Agent Teams

Agent teams are best for **parallel, independent work** that benefits from cross-communication:

| Good use cases | Bad use cases |
|---|---|
| Research & review (multiple angles) | Sequential tasks |
| New modules/features (separate ownership) | Same-file edits |
| Debugging competing hypotheses | Highly dependent steps |
| Cross-layer coordination (frontend + backend + tests) | Simple, focused tasks |

> **Token cost warning:** Each teammate is a separate Claude instance with its own context window. 3-5 teammates is the sweet spot.

### Team Configuration for Track Bite (DietPilot 2.0)

When spawning teams for this project, use these role templates:

| Role | Scope | Owns |
|------|-------|------|
| **Frontend Lead** | React components, pages, Tailwind styling | `frontend/src/` |
| **Backend Lead** | Flask proxy, API routes, USDA/Wger integration | `backend/` |
| **QA / Reviewer** | Testing, accessibility, design system compliance | Cross-cutting |
| **DevOps** | Capacitor builds, CI/CD, deployment | `android/`, `.github/` |

Example prompt to start a team:
```text
Create an agent team with 3 teammates:
- Frontend: refactor the Dashboard components
- Backend: add new food search endpoint
- QA: review both for design system compliance
```

### How Teams Work

```
┌─────────────┐
│  Team Lead   │ ← You interact here
│  (main CLI)  │
└──────┬───────┘
       │ spawns & coordinates
  ┌────┼────────────┐
  │    │             │
┌─▼──┐ ┌─▼──┐  ┌────▼───┐
│ T1 │ │ T2 │  │  T3    │
│    │ │    │  │        │
└──┬─┘ └──┬─┘  └───┬────┘
   │      │        │
   └──────┼────────┘
          │
   Shared Task List
   (file-locked claims)
```

- **Lead** creates tasks, coordinates, synthesizes results
- **Teammates** work independently in their own context windows
- **Messaging**: teammates can message each other directly (not just report to lead)
- **Task states**: pending → in progress → completed (with dependency tracking)

### Display Mode

- **In-process** (current, Windows-compatible): all teammates in one terminal
  - `Shift+Down` to cycle through teammates
  - `Enter` to view a teammate's session
  - `Escape` to interrupt a teammate's turn
  - `Ctrl+T` to toggle task list
- **Split panes** (macOS only): requires tmux or iTerm2

### Key Commands

| Action | How |
|--------|-----|
| Navigate teammates | `Shift+Down` (cycles, wraps around) |
| View teammate session | `Enter` |
| Interrupt teammate | `Escape` |
| Toggle task list | `Ctrl+T` |
| Shut down a teammate | Tell lead: "Ask the [role] teammate to shut down" |
| Clean up team | Tell lead: "Clean up the team" |

### Controlling Teammates

- **Require plan approval**: "Spawn an architect teammate. Require plan approval before changes."
- **Specify models**: "Use Sonnet for each teammate."
- **Direct messaging**: navigate to any teammate and type instructions directly
- **Self-claiming tasks**: after finishing, teammates auto-claim next unblocked task

### Quality Gates (Hooks)

| Hook | Trigger | Exit code 2 = |
|------|---------|---------------|
| `TeammateIdle` | Teammate about to go idle | Send feedback, keep working |
| `TaskCreated` | Task being created | Prevent creation + feedback |
| `TaskCompleted` | Task being marked complete | Prevent completion + feedback |

### Rules for This Project

1. **File ownership**: each teammate edits only their designated files. No two teammates touch the same file.
2. **Design system compliance**: all frontend teammates MUST follow Design System Law in `gemini.md` §2.
3. **Plan approval for risky work**: require plan approval for database schema changes, API contract changes, or architecture refactors.
4. **5-6 tasks per teammate**: keeps everyone productive without excessive context switching.
5. **Always clean up via lead**: never let teammates run cleanup — it can leave resources in an inconsistent state.

### Limitations (Experimental)

- No session resumption for in-process teammates (`/resume` won't restore them)
- Task status can lag — manually update if stuck
- One team per session, no nested teams
- Lead is fixed (can't transfer leadership)
- Split panes don't work on Windows Terminal or VS Code integrated terminal

### Storage

- Team config: `~/.claude/teams/{team-name}/config.json`
- Task list: `~/.claude/tasks/{team-name}/`

---

## Summary

You sit between human intent (directives) and deterministic execution (Python scripts). Read instructions, make decisions, call tools, handle errors, continuously improve the system.

For complex parallel work, use **Agent Teams** to coordinate multiple Claude Code instances with shared task lists and direct inter-agent messaging.

Be pragmatic. Be reliable. Self-anneal.
