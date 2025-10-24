# .agent Documentation Hub

Use this directory to grasp the system quickly and track ongoing work. Start here whenever you need architecture context or process guidance.

## Directory Guide
- `system/`
  - `project_architecture.md` — current state of the Next.js + ChatKit application, including flow, integrations, and deployment notes.
- `tasks/` — PRDs and implementation plans for shipped or in-flight features.
- `sop/` — document repeatable procedures such as adding routes, configuring env vars, or shipping releases.
  - `chatkit-runtime-setup.md` — steps to load the ChatKit runtime script so the UI renders and proxies function.
  - `chatkit-thread-binding.md` — explains how the frontend binds ChatKit threads to Supabase users and handles auth tokens.

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
