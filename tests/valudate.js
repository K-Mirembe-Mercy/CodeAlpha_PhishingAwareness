/* Zero-dependency checks for content integrity and CSP-friendliness. * Run with: node tests/validate.js */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const D = require(path.join(root, "js", "data.js"));
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "js", "app.js"), "utf8");
const css = fs.readFileSync(path.join(root, "css", "styles.css"), "utf8");

const errors = [];
const check = (cond, msg) => {
  if (!cond) errors.push(msg);
};

// Quiz
check(
  D.quiz.length === 10,
  "quiz must have exactly 10 questions (found " + D.quiz.length + ")"
);
D.quiz.forEach((q, n) => {
  const id = "quiz[" + n + "]";
  check(
    typeof q.q === "string" && q.q.length > 10,
    id + ": missing question text"
  );
  check(
    Array.isArray(q.options) && q.options.length === 4,
    id + ": needs exactly 4 options"
  );
  check(
    new Set(q.options).size === q.options.length,
    id + ": duplicate options"
  );
  check(
    Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length,
    id + ": invalid answer index"
  );
  check(
    D.quizCategories.includes(q.category),
    id + ": unknown category " + q.category
  );
  check(
    typeof q.explain === "string" && q.explain.length > 10,
    id + ": missing explanation"
  );
});
D.quizCategories.forEach((c) =>
  check(
    D.quiz.some((q) => q.category === c),
    "category with no questions: " + c
  )
);

// Emails: every flag is defined and appears exactly once in the message
D.emails.forEach((e) => {
  const used = [];
  const scan = (parts) =>
    parts.forEach((p) => {
      if (typeof p === "object") used.push(p.f);
    });
  e.headers.forEach((hd) => scan(hd.parts));
  e.body.forEach(scan);
  used.forEach((f) =>
    check(
      e.flags[f],
      "email " + e.id + ": flag '" + f + "' used but not defined"
    )
  );
  Object.keys(e.flags).forEach((f) =>
    check(
      used.filter((u) => u === f).length === 1,
      "email " + e.id + ": flag '" + f + "' must appear exactly once"
    )
  );
});

// URL game
check(D.urlGame.length >= 6, "urlGame needs at least 6 items");
check(
  D.urlGame.some((u) => u.legit) && D.urlGame.some((u) => !u.legit),
  "urlGame needs both legit and fake items"
);
D.urlGame.forEach((u, n) =>
  check(
    u.url && typeof u.legit === "boolean" && u.why,
    "urlGame[" + n + "] incomplete"
  )
);

// Tactics, cases, practices
const leverNames = D.levers.map((l) => l.name);
D.tactics.forEach((t) => {
  ["id", "title", "channel", "what", "example", "defence"].forEach((k) =>
    check(t[k], "tactic " + t.id + ": missing " + k)
  );
  t.levers.forEach((l) =>
    check(leverNames.includes(l), "tactic " + t.id + ": unknown lever " + l)
  );
});
D.cases.forEach((c) =>
  ["id", "year", "title", "type", "what", "impact", "lesson"].forEach((k) =>
    check(c[k], "case " + c.id + ": missing " + k)
  )
);
const ids = [...D.practices.everyday, ...D.practices.teams].map((p) => p.id);
check(new Set(ids).size === ids.length, "practice ids must be unique");
check(D.practices.ifClicked.length >= 5, "ifClicked needs at least 5 steps");

// Security: strict-CSP friendliness
check(
  /Content-Security-Policy/.test(html),
  "index.html must declare a Content-Security-Policy"
);
check(
  !/<script(?![^>]*\bsrc=)[^>]*>/i.test(html),
  "index.html must not contain inline <script>"
);
check(
  !/\son[a-z]+\s*=/i.test(html),
  "index.html must not contain inline event handlers"
);
check(
  !/\sstyle\s*=/i.test(html),
  "index.html must not contain inline style attributes"
);
check(!/<style[\s>]/i.test(html), "index.html must not contain <style> blocks");
check(
  !/innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(|new Function/.test(
    app
  ),
  "app.js must not use innerHTML, eval or similar"
);
check(
  !/<(link|script|img|iframe|source|embed|object)\b[^>]*\b(src|href|data)\s*=\s*["']?(https?:)?\/\//i.test(
    html
  ),
  "index.html must not load external resources"
);
check(
  !/@import|url\(\s*['"]?https?:/.test(css),
  "styles.css must not load external resources"
);

if (errors.length) {
  console.error("FAILED (" + errors.length + "):\n - " + errors.join("\n - "));
  process.exit(1);
}
console.log(
  "OK: content and security checks passed (" +
    D.quiz.length +
    " quiz questions, " +
    D.emails.length +
    " emails, " +
    D.cases.length +
    " cases)."
);
