# .agent Documentation Hub

Use this directory to grasp the system quickly and track ongoing work. Start here whenever you need architecture context or process guidance.

## Directory Guide
- `system/`
  - `project_architecture.md` — current state of the Next.js + ChatKit application, including flow, integrations, streaming search animation handling, and deployment notes.
- `tasks/`
  - `task-search-tool-loading-animation.md` — implementation plan for the branded search loader.
  - `task-search-animation-refractor.md` — migration notes for consuming ChatKit SSE progress markers.
  - `task-search-animation-followup.md` — open investigation into loader visibility and ChatKit stream edge cases.
  - `TODO.md` — backlog scratchpad for upcoming work.
- `sop/`
  - `chatkit-runtime-setup.md` — steps to load the ChatKit runtime script so the UI renders and proxies function.

## Getting Started Checklist
1. Read `system/project_architecture.md` for an architectural overview.
2. Review `tasks/` for any active initiatives once populated.
3. Contribute new SOPs when you establish a repeatable workflow.

## Maintenance Expectations
- Update `system/` docs whenever code structure, dependencies, or integrations change.
- Keep `tasks/` scoped to active or historical projects; close the loop once delivered.
- Ensure every new document includes a **Related Docs** section and is linked in this README.

## Related Docs
- `.agent/system/project_architecture.md`
- `.agent/tasks/task-search-tool-loading-animation.md`
- `.agent/tasks/task-search-animation-refractor.md`
- `.agent/tasks/task-search-animation-followup.md`
- `.agent/sop/chatkit-runtime-setup.md`
