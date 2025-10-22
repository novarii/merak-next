# SOP: Loading the ChatKit Runtime in Next.js

## Purpose
Ensure the `<openai-chatkit>` custom element is registered so the ChatKit UI renders and can reach the FastAPI proxy.

## Prerequisites
- Next.js App Router project with `@openai/chatkit-react` installed.
- Network access to `https://cdn.platform.openai.com`.
- Domain allow-listed in the OpenAI dashboard (matches `CHATKIT_API_DOMAIN_KEY`).

## Steps
1. **Add the script tag**
   - In `app/layout.tsx`, inject the ChatKit runtime before React hydrates:
     ```tsx
     import Script from 'next/script';
     
     export default function RootLayout({ children }: { children: React.ReactNode }) {
       return (
         <html lang="en">
           <head>
             <Script
               src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
               strategy="beforeInteractive"
             />
             {/* existing tags */}
           </head>
           <body>{children}</body>
         </html>
       );
     }
     ```
   - Using `strategy="beforeInteractive"` guarantees the element is defined before the `ChatKit` React component mounts.
2. **Deploy environment variables**
   - Confirm `NEXT_PUBLIC_CHATKIT_API_DOMAIN_KEY` matches the domain you registered.
   - Ensure the FastAPI proxy (`BACKEND_URL`) is reachable from the Next.js server.
3. **Restart dev server**
   - Run `npm run dev` (or restart your hosting runtime). Hot reload alone may not pull in new `<Script>` tags.

## Validation
- Load the app and run `customElements.get('openai-chatkit')` in the browser console; it should return a constructor instead of `undefined`.
- Open DevTools → Network and confirm POST requests hit `/chatkit` when you send a message (e.g., `threads.create`).
- The ChatKit panel should render instead of a blank space.

## Troubleshooting
- **Runtime blocked**: If the script fails to load, check Content Security Policy headers and ensure the CDN domain is allowed.
- **403 responses**: Revisit the domain allow-list; mismatch causes OpenAI to reject proxied requests.
- **No network calls**: Make sure `app/layout.tsx` is the App Router layout. Pages Router projects require adding the script to `_app.tsx` or `_document.tsx` instead.

## Related Docs
- `.agent/system/project_architecture.md`
- https://openai.github.io/chatkit-js (ChatKit embedding guide)
