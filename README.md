# CodeAlpha Phishing Awareness

An interactive, in-browser training module that teaches people to spot and respond to phishing. It covers spotting red flags in emails, recognising fake websites, social engineering tactics, best practices, real cases and a 10-question quiz with scoring.

Built for the **CodeAlpha Cyber Security Internship**.

**Live demo:** https://k-mirembe-mercy.github.io/CodeAlpha_PhishingAwareness/ (available after you enable GitHub Pages, see below)

## What's inside

| Module | What you do |
|--------|-------------|
| **1. Red flags** | Tap the suspicious parts of two simulated scam emails and learn why each is a clue |
| **2. Fake websites** | Learn to read a web address, then play a real-or-fake address game and read practical tips |
| **3. Social engineering** | Understand 7 psychological levers and 10 common tactics (phishing, vishing, smishing, BEC, MFA fatigue, quishing and more) |
| **4. Best practices** | Tick off everyday and team habits, and follow the "I already clicked" steps |
| **5. Real cases** | Six publicly reported incidents with what happened, impact and lessons |
| **6. Quiz** | 10 shuffled questions, instant explanations, score by topic and review of mistakes |

## Run it locally

No build step and no dependencies. It is plain HTML, CSS and JavaScript.

```bash
git clone https://github.com/K-Mirembe-Mercy/CodeAlpha_PhishingAwareness.git
cd CodeAlpha_PhishingAwareness
python -m http.server 8000
```

Open http://localhost:8000. (You can also open `index.html` directly in a browser.)

## Publish with GitHub Pages

1. Push the repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then **Save**.
4. After a minute your site is live at `https://<your-username>.github.io/CodeAlpha_PhishingAwareness/`.

## Security and privacy by design

- **No data collected.** There are no network requests, analytics, cookies or third-party scripts.
- **Strict Content-Security-Policy** (`default-src 'none'`, scripts and styles only from the site itself), with no inline scripts, inline styles or event handlers.
- **No HTML injection.** The code builds the page with DOM methods and text nodes, never `innerHTML` or `eval`.
- **Local progress only.** Quiz best score and ticked habits are saved in your browser's `localStorage` and never leave your device.
- **Safe simulations.** All sample emails and links are fictional and rendered as plain text, so nothing in the module is clickable or dangerous.
- **Automated checks.** `tests/validate.js` verifies content integrity and fails the build if inline scripts, `innerHTML` or external resources are introduced.

## Project structure

```
index.html          Page structure and Content-Security-Policy
css/styles.css      Responsive, light/dark styling
js/data.js          All lesson content, emails, cases and quiz questions
js/app.js           Interactive logic (routing, email lab, URL game, quiz)
assets/favicon.svg  Icon
tests/validate.js   Content and security checks (no dependencies)
.github/            CI workflow and Dependabot config
```

## Customise the content

All lessons live in `js/data.js`. To add a quiz question, append an object with `q`, four `options`, the `answer` index, a `category` and an `explain` text. Then run:

```bash
node tests/validate.js
```

(The validator expects exactly 10 questions, so update that number in the test if you change the quiz length.)

## Accessibility

Keyboard-friendly controls, visible focus styles, a skip link, screen-reader announcements for feedback, responsive layout for phones and automatic dark mode. It also respects the reduced-motion setting.

## Sources and notes

The real cases are short summaries of widely reported incidents (RSA 2011, Target 2013, a 2015 fake-invoice fraud, the 2016 campaign-email phishing, Twitter 2020 and Uber 2022). Figures are approximate and drawn from public reporting. Please check the original reporting before quoting them.

## Disclaimer

For education and awareness only. Brands and people in the simulations are fictional.

## License

[MIT](LICENSE)

## Author

**Kafeero Mirembe Mercy**: [GitHub](https://github.com/K-Mirembe-Mercy) · [LinkedIn](https://ug.linkedin.com/in/kafeero-mirembe-mercy-25b953343)
