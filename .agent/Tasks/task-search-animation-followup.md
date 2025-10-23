## Issue: Progress Animation Never Shows Despite Stream Markers

- In `feature/search-animation` branch, the frontend intercepts the `/chatkit` SSE stream and logs `progress_update` markers (`search_animation:start/stop`) from the backend.
- Console shows `[ChatKitPanel] progress_update marker: search_animation:start`, immediately followed by `...stop`, and the HomePage effect logs only `loader requested OFF`. The carousel visibility effect never logs, so the loader stays hidden.
- Even after padding the backend to delay `search_animation:stop` by 1.5 s, the HomePage still only logs the OFF state; `setShowSearchLoader(true)` appears to be a no-op.
- Need to debug why the state toggle (and resulting animation) never occurs despite receiving `start`. Possibly `setShowSearchLoader(true)` is skipped due to stale state, wrong effect dependencies, or `loaderForced` override toggles.
- Next steps for the follow-up: trace the state updates in React DevTools or add more granular logs around `setShowSearchLoader`, confirm the effect reruns with `isSearchAnimating=true`, and verify the backend isn't sending multiple `stop` events suppressing the start.

## Related Docs
- `.agent/system/project_architecture.md`
- `.agent/tasks/task-search-tool-loading-animation.md`
- `.agent/tasks/task-search-animation-refractor.md`
