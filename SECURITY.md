# Security Policy

This is a static, client-side training module. It has no server, no accounts and no data collection.

## Reporting a vulnerability

If you find a security issue (for example a way to inject script, bypass the Content-Security-Policy, or leak data), please use GitHub's **private vulnerability reporting** (Security tab) or open an issue without exploit details. Include the browser, steps to reproduce and the impact.

## Design rules for contributors

- No inline scripts, inline styles or inline event handlers.
- No `innerHTML`, `eval` or `new Function`. Build content with DOM methods and `textContent`.
- No external scripts, fonts, images or network requests.
- Keep simulated phishing content as plain text, never as live links.

`node tests/validate.js` enforces these rules in CI.

## Supported versions

Only the latest commit on `main` is maintained.
