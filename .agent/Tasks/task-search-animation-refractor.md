## Search Animation Hookup

  - Subscribe to the existing ChatKit SSE stream. Use your current EventSource/WebSocket wrapper; no new endpoint. Listen for each
    ThreadStreamEvent as it arrives.
  - Check for progress updates. Each event payload includes type. When type === "progress_update", look inside data.event.
  - Toggle the spinner on these markers:
      - search_animation:start → call startSpinner() (or your equivalent).
      - search_animation:stop → call stopSpinner().

    (Keep handling assistant_message, client_tool_call, etc., exactly as today.)
  - Example (EventSource straight in the browser):

    source.onmessage = (evt) => {
      const payload = JSON.parse(evt.data);

      if (payload.type === "progress_update") {
        switch (payload.data?.event) {
          case "search_animation:start":
            startSpinner();
            break;
          case "search_animation:stop":
            stopSpinner();
            break;
        }
        return;
      }

      // existing handling for assistant_message, client_tool_call, etc.
    };
  - Debug tips.