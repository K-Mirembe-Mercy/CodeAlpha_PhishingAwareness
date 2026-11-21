/* Phishing Awareness Module: UI logic.
 * Security notes: content is built with DOM methods and text nodes only (never parsed from HTML strings),
 * no inline scripts or styles (works with a strict Content-Security-Policy),
 * no network requests, and progress is stored only in this browser's localStorage.
 */
(function () {
  "use strict";

  const D = window.PHISH_DATA;
  const MODULES = ["home", "email", "websites", "social", "practices", "cases", "quiz"];
  const TITLES = {
    home: ["Start", "", "🏠"],
    email: ["Red flags", "Two realistic scam emails. Tap the clues.", "🚩"],
    websites: ["Fake websites", "Read web addresses and play real-or-fake.", "🌐"],
    social: ["Social engineering", "7 levers and 10 tactics attackers use.", "🧠"],
    practices: ["Best practices", "Habits that keep you and your team safe.", "✅"],
    cases: ["Real cases", "Famous attacks that began with one click.", "📰"],
    quiz: ["Final quiz", "10 questions, instant feedback and a score.", "🎯"]
  };

  /* ---------- helpers ---------- */
  const store = {
    get(key, fallback) {
      try {
        const v = window.localStorage.getItem("pam:" + key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { window.localStorage.setItem("pam:" + key, JSON.stringify(value)); } catch (e) { /* storage may be unavailable */ }
    }
  };

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === false || v === null || v === undefined) continue;
      if (k === "class") el.className = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) {
      if (kid === null || kid === undefined || kid === false) continue;
      el.append(kid);
    }
    return el;
  }

  function randInt(n) {
    const buf = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / n) * n;
    let x;
    do { window.crypto.getRandomValues(buf); x = buf[0]; } while (x >= limit);
    return x % n;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const $ = (id) => document.getElementById(id);

  /* ---------- router and progress ---------- */
  let firstRoute = true;

  function currentModule() {
    const id = window.location.hash.replace("#", "");
    return MODULES.includes(id) ? id : "home";
  }

  function route() {
    const id = currentModule();
    document.querySelectorAll(".module").forEach((s) => { s.hidden = s.id !== id; });
    const visited = new Set(store.get("visited", []));
    visited.add(id);
    store.set("visited", Array.from(visited));
    document.querySelectorAll("[data-nav]").forEach((a) => {
      if (a.dataset.nav === id) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      a.classList.toggle("done", visited.has(a.dataset.nav) && a.dataset.nav !== id);
    });
    $("progress-text").textContent = visited.size + " / " + MODULES.length;
    $("progress-fill").style.width = Math.round((visited.size / MODULES.length) * 100) + "%";
    if (!firstRoute) {
      window.scrollTo(0, 0);
      const heading = document.querySelector("#" + id + " h1, #" + id + " h2");
      if (heading) heading.focus({ preventScroll: true });
    }
    firstRoute = false;
  }

  /* ---------- home cards ---------- */
  function buildStartCards() {
    const root = $("start-cards");
    MODULES.filter((m) => m !== "home").forEach((m, i) => {
      root.append(h("a", { class: "pcard" + (m === "quiz" ? " quiz" : ""), href: "#" + m },
        h("span", { class: "ico", "aria-hidden": "true" }, TITLES[m][2]),
        h("span", {}, h("h3", {}, (i + 1) + ". " + TITLES[m][0]), h("p", {}, TITLES[m][1]))));
    });
  }

  /* ---------- module 1: red-flag email lab ---------- */
  function buildEmailLab() {
    const root = $("email-lab");
    const found = {};
    D.emails.forEach((e) => { found[e.id] = new Set(); });
    const tabs = h("div", { class: "tabs", role: "group", "aria-label": "Choose an email" });
    const stage = h("div");
    root.append(tabs, stage);

    function show(index) {
      const email = D.emails[index];
      const ids = Object.keys(email.flags);
      const buttons = {};
      tabs.replaceChildren(...D.emails.map((e, i) =>
        h("button", { class: "btn", type: "button", "aria-pressed": String(i === index), onclick: () => show(i) }, e.title)));

      const detail = h("div", { class: "detail", "aria-live": "polite" },
        h("span", {}, "Tap any underlined part of the email to see why it is suspicious."));
      const counter = h("p", { class: "counter", "aria-live": "polite" });

      function updateCounter() {
        const n = found[email.id].size;
        const done = n === ids.length;
        counter.textContent = "Red flags found: " + n + " / " + ids.length + (done ? ". Great eye!" : "");
        counter.classList.toggle("win", done);
      }

      function mark(id) {
        found[email.id].add(id);
        const b = buttons[id];
        if (b) { b.classList.add("found"); b.setAttribute("aria-pressed", "true"); }
      }

      function reveal(id) {
        mark(id);
        const f = email.flags[id];
        detail.replaceChildren(h("b", {}, f.title), h("span", {}, f.why));
        updateCounter();
      }

      function part(p) {
        if (typeof p === "string") return p;
        const already = found[email.id].has(p.f);
        const b = h("button", {
          class: "hot" + (already ? " found" : ""), type: "button",
          "aria-pressed": String(already), onclick: () => reveal(p.f)
        }, p.t);
        buttons[p.f] = b;
        return b;
      }

      const subjectHdr = email.headers.find((x) => x.label === "Subject");
      const fromHdr = email.headers.find((x) => x.label === "From");
      const initial = String(fromHdr.parts[0]).trim().charAt(0).toUpperCase();
      const body = email.body.map((par) => h("p", {}, par.map(part)));
      const card = h("div", { class: "email" },
        h("div", { class: "email-bar", "aria-hidden": "true" }, h("span", { class: "d d1" }), h("span", { class: "d d2" }), h("span", { class: "d d3" })),
        h("div", { class: "subject" }, subjectHdr.parts.map(part)),
        h("div", { class: "sender" },
          h("div", { class: "avatar", "aria-hidden": "true" }, initial),
          h("div", {}, h("span", { class: "lbl" }, "From"), h("div", {}, fromHdr.parts.map(part)))),
        h("div", { class: "email-body" }, body));

      const revealAll = h("button", { class: "btn", type: "button", onclick: () => {
        ids.forEach(mark);
        detail.replaceChildren(h("b", {}, "All red flags revealed"), h("span", {}, "Review each highlighted part to see why it matters."));
        updateCounter();
      } }, "Reveal all");
      const reset = h("button", { class: "btn", type: "button", onclick: () => { found[email.id].clear(); show(index); } }, "Start over");

      stage.replaceChildren(
        h("p", {}, email.intro),
        card,
        counter, detail,
        h("div", { class: "row" }, revealAll, reset));
      updateCounter();
    }
    show(0);
  }

  /* ---------- module 2: URL game ---------- */
  function buildUrlGame() {
    const root = $("url-game");
    let order, i, score;

    function start() { order = shuffle(D.urlGame); i = 0; score = 0; render(); }

    function render() {
      if (i >= order.length) {
        const msg = score === order.length ? "Perfect. You read addresses like a pro."
          : score >= order.length - 2 ? "Very good. Review the ones you missed."
            : "Keep practising: read each address from the first single slash backwards.";
        root.replaceChildren(h("div", { class: "card" },
          h("h3", {}, "You scored " + score + " / " + order.length),
          h("p", {}, msg),
          h("button", { class: "btn primary", type: "button", onclick: start }, "Play again")));
        return;
      }
      const item = order[i];
      const fb = h("div", { "aria-live": "polite" });
      const next = h("button", { class: "btn primary", type: "button", hidden: true, onclick: () => { i++; render(); } },
        i === order.length - 1 ? "See result" : "Next address");
      const legitBtn = h("button", { class: "btn", type: "button" }, "Looks legitimate");
      const fakeBtn = h("button", { class: "btn", type: "button" }, "Looks fake");

      function answer(guessLegit) {
        legitBtn.disabled = true; fakeBtn.disabled = true;
        const ok = guessLegit === item.legit;
        if (ok) score++;
        fb.replaceChildren(h("div", { class: "feedback " + (ok ? "ok" : "no") },
          h("b", {}, (ok ? "Correct. " : "Not quite. ") + (item.legit ? "This one is legitimate. " : "This one is fake. ")), item.why));
        next.hidden = false;
        next.focus();
      }
      legitBtn.addEventListener("click", () => answer(true));
      fakeBtn.addEventListener("click", () => answer(false));

      root.replaceChildren(h("div", { class: "card" },
        h("p", { class: "qmeta" }, "Address " + (i + 1) + " of " + order.length + " · Score " + score),
        h("div", { class: "addr" }, h("span", { "aria-hidden": "true" }, "🌐"), h("span", {}, item.url)),
        h("div", { class: "row" }, legitBtn, fakeBtn),
        fb, h("div", { class: "row" }, next)));
    }
    start();
  }

  /* ---------- module 3: tactics ---------- */
  function buildTactics() {
    $("levers").replaceChildren(...D.levers.map((l) =>
      h("div", { class: "card lever" }, h("h3", {}, l.name), h("p", {}, l.text))));
    $("tactics").replaceChildren(...D.tactics.map((t) =>
      h("details", { class: "tactic" },
        h("summary", {}, t.title, " ", h("span", { class: "chip" }, t.channel)),
        h("div", { class: "body" },
          h("p", {}, t.what),
          h("blockquote", {}, t.example),
          h("p", {}, h("b", {}, "Levers used: "), t.levers.map((l) => h("span", { class: "chip" }, l))),
          h("p", {}, h("b", {}, "How to defend: "), t.defence)))));
  }

  /* ---------- module 4: best practices ---------- */
  function buildPractices() {
    const root = $("practices-lab");
    const checks = store.get("checks", {});
    const total = D.practices.everyday.length + D.practices.teams.length;
    const summary = h("p", { class: "counter", "aria-live": "polite" });

    function update() {
      const n = Object.values(checks).filter(Boolean).length;
      summary.textContent = "Habits committed: " + n + " / " + total;
      summary.classList.toggle("win", n === total);
    }

    function list(items) {
      return items.map((it) => {
        const box = h("input", { type: "checkbox" });
        box.checked = !!checks[it.id];
        box.addEventListener("change", () => { checks[it.id] = box.checked; store.set("checks", checks); update(); });
        return h("label", { class: "check" }, box, h("span", {}, it.text));
      });
    }

    root.replaceChildren(
      summary,
      h("h3", {}, "Every day, for everyone"), h("div", { class: "card" }, list(D.practices.everyday)),
      h("h3", {}, "For teams and organisations"), h("div", { class: "card" }, list(D.practices.teams)),
      h("h3", {}, "If you already clicked: what to do"),
      h("div", { class: "card" }, h("ol", { class: "steps" }, D.practices.ifClicked.map((s) => h("li", {}, s)))));
    update();
  }

  /* ---------- module 5: cases ---------- */
  function buildCases() {
    $("case-list").replaceChildren(...D.cases.map((c) =>
      h("article", { class: "card case" },
        h("h3", {}, h("span", { class: "year" }, String(c.year)), c.title, h("span", { class: "chip" }, c.type)),
        h("dl", {},
          h("dt", {}, "What happened"), h("dd", {}, c.what),
          h("dt", {}, "Impact"), h("dd", {}, c.impact),
          h("dt", {}, "Lesson"), h("dd", { class: "lesson" }, c.lesson)))));
  }

  /* ---------- module 6: quiz ---------- */
  function buildQuiz() {
    const root = $("quiz-lab");
    const LETTERS = ["A", "B", "C", "D"];
    let qs, i, answers;

    function tier(score) {
      if (score >= 9) return ["Phishing expert", "Excellent. You spot the tricks and know how to respond."];
      if (score >= 7) return ["Well aware", "Good work. Review the questions you missed and you will be nearly unfoolable."];
      if (score >= 5) return ["Getting there", "You have the basics. Revisit the red flags and tactics modules, then try again."];
      return ["At risk", "Do not worry. Work through the modules again, then retake the quiz."];
    }

    function intro() {
      const best = store.get("best", null);
      root.replaceChildren(h("div", { class: "card" },
        h("p", {}, "Answer " + D.quiz.length + " questions. You get 1 point for each correct answer. Questions and answer order are shuffled each time."),
        best === null ? null : h("p", { class: "qmeta" }, "Your best score on this device: " + best + " / " + D.quiz.length),
        h("button", { class: "btn primary", type: "button", onclick: begin }, "Start quiz")));
    }

    function begin() {
      qs = shuffle(D.quiz).map((q) => {
        const opts = shuffle(q.options.map((text, k) => ({ text, k })));
        return { q: q.q, category: q.category, explain: q.explain,
          options: opts.map((o) => o.text), answer: opts.findIndex((o) => o.k === q.answer) };
      });
      i = 0; answers = [];
      ask();
    }

    function ask() {
      const q = qs[i];
      const fb = h("div", { "aria-live": "polite" });
      const next = h("button", { class: "btn primary", type: "button", hidden: true,
        onclick: () => { i++; if (i < qs.length) ask(); else finish(); } },
        i === qs.length - 1 ? "See my score" : "Next question");
      const optButtons = q.options.map((text, k) => h("button", { class: "opt", type: "button" },
        h("span", { class: "k" }, LETTERS[k] + "."), h("span", {}, text)));

      optButtons.forEach((btn, k) => btn.addEventListener("click", () => {
        optButtons.forEach((b) => { b.disabled = true; });
        const ok = k === q.answer;
        answers.push({ q, chosen: k, ok });
        optButtons[q.answer].classList.add("correct");
        if (!ok) btn.classList.add("wrong");
        fb.replaceChildren(h("div", { class: "feedback " + (ok ? "ok" : "no") },
          h("b", {}, ok ? "Correct! " : "Not quite. "), q.explain));
        next.hidden = false;
        next.focus();
      }));

      const fill = h("div", { class: "qfill" });
      fill.style.width = Math.round((i / qs.length) * 100) + "%";
      root.replaceChildren(h("div", { class: "card" },
        h("p", { class: "qmeta" }, "Question " + (i + 1) + " of " + qs.length + " · " + q.category),
        h("div", { class: "qbar", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(qs.length), "aria-valuenow": String(i) }, fill),
        h("p", { class: "question" }, q.q),
        h("div", { class: "opts" }, optButtons),
        fb, h("div", { class: "row" }, next)));
    }

    function finish() {
      const score = answers.filter((a) => a.ok).length;
      const prev = store.get("best", null);
      if (prev === null || score > prev) store.set("best", score);
      const [label, msg] = tier(score);

      const cats = D.quizCategories.map((c) => {
        const inCat = answers.filter((a) => a.q.category === c);
        const right = inCat.filter((a) => a.ok).length;
        const pct = inCat.length ? Math.round((right / inCat.length) * 100) : 0;
        const val = h("div", { class: "val" });
        val.style.width = pct + "%";
        return h("div", { class: "cat" }, h("span", {}, c), h("div", { class: "track" }, val), h("span", {}, right + "/" + inCat.length));
      });

      const missed = answers.filter((a) => !a.ok);
      const review = missed.length === 0
        ? [h("p", {}, "You answered every question correctly. Nothing to review.")]
        : missed.map((a) => h("div", { class: "review" },
          h("p", {}, h("b", {}, a.q.q)),
          h("p", {}, "Your answer: ", a.q.options[a.chosen]),
          h("p", {}, h("b", {}, "Correct answer: "), a.q.options[a.q.answer]),
          h("p", {}, a.q.explain)));

      const pct = Math.round((score / qs.length) * 100);
      const ring = h("div", { class: "ring", role: "img", "aria-label": "Score " + score + " out of " + qs.length },
        h("div", { class: "ring-in" }, h("span", { class: "big" }, String(score), h("small", {}, " / " + qs.length))));
      ring.style.setProperty("--pct", String(pct));
      root.replaceChildren(
        h("div", { class: "card score " + (score >= 7 ? "t-high" : score >= 5 ? "t-mid" : "t-low") },
          ring,
          h("h3", {}, label), h("p", {}, msg),
          h("div", { class: "row" },
            h("button", { class: "btn primary", type: "button", onclick: begin }, "Retake quiz"),
            h("a", { class: "btn", href: "#email" }, "Review the modules"))),
        h("h3", {}, "Score by topic"), h("div", { class: "card" }, cats),
        h("h3", {}, missed.length ? "Review your mistakes" : "Review"), ...review);
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    intro();
  }

  /* ---------- init ---------- */
  function init() {
    if (!D) { return; }
    buildStartCards();
    buildEmailLab();
    buildUrlGame();
    buildTactics();
    buildPractices();
    buildCases();
    buildQuiz();
    MODULES.forEach((m, idx) => {
      if (m === "home") return;
      const prev = MODULES[idx - 1];
      const next = MODULES[idx + 1];
      $(m).append(h("div", { class: "pager" },
        h("a", { class: "btn", href: "#" + prev }, "← " + TITLES[prev][0]),
        next ? h("a", { class: "btn primary", href: "#" + next }, TITLES[next][0] + " →") : null));
    });
    window.addEventListener("hashchange", route);
    route();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
