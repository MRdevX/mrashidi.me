#!/usr/bin/env python3
"""Lint an outbound draft against writing.md before the user sees it.

    draft-lint.py draft.md            # Jira comment / ticket (md2adf input)
    draft-lint.py --github body.md    # PR body or single GitHub comment
    draft-lint.py review.json         # GitHub review: body + comments[].body
    draft-lint.py --selftest          # also runs the fixtures in ../tests/drafts

Prints one line per problem and exits 1 if any. Code blocks and inline code are not checked.
"""
import json
import pathlib
import re
import sys

LABELS = ("**Blocker:**", "**Suggestion (non-blocking):**", "**Question:**")
MAX_COMMENT_LINES = 8  # prose lines per review comment, code and <details> excluded
PHRASES = [
    "great news", "hope this helps", "let me know if", "feel free to", "happy to help",
    "just ", "simply", "obviously", "clearly", "why didn't you", "you forgot", "you should have",
    "might possibly", "could potentially", "seems to possibly", "thorough investigation", "deep dive",
]
CHECKS = [
    ("em dash", re.compile("\u2014")),
    ("commit SHA", re.compile(r"\b[0-9a-f]{40}\b")),
    ("UUID", re.compile(r"\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b", re.I)),
    ("UTC timestamp", re.compile(r"\b\d{4}-\d\d-\d\dT\d\d:\d\d")),
]
URL = re.compile(r"https?://\S+")


def prose(s):
    """Drop fenced code, <details> evidence and inline code: they are allowed to hold anything."""
    s = re.sub(r"```.*?```", "", s, flags=re.S)
    s = re.sub(r"<details>.*?</details>", "", s, flags=re.S)
    return re.sub(r"`[^`\n]+`", "", s)


def lint(text, where, github):
    out, p = [], prose(text)
    for line in p.splitlines():
        s = line.strip()
        lone_link = re.fullmatch(r"<?https?://\S+?>?", s)  # permalink (GitHub) or smart link (Jira)
        bare = URL.sub("", re.sub(r"\]\(https?://[^)]+\)", "](", s))
        if URL.search(s) and not lone_link and URL.search(re.sub(r"\]\(https?://[^)]+\)", "", s)):
            out.append(f"{where}: bare URL, use [text](url): {s[:60]}")
        for name, rx in CHECKS:
            if rx.search(bare):
                out.append(f"{where}: {name}: {s[:60]}")
        if not github and re.search(r"(?<![\w\[])@(?!\[)\w+", bare):
            out.append(f"{where}: bare @mention won't notify; use @[Name](accountId): {s[:60]}")
        low = f" {bare.lower()} "
        out += [f"{where}: phrase '{ph.strip()}': {s[:60]}" for ph in PHRASES if ph in low]
    if github and re.search(r"^\s*> \[!(info|note|success|warning|error|panel|expand)\b", p, re.M):
        out.append(f"{where}: Jira callout in a GitHub draft; use > [!NOTE]/[!WARNING]/[!IMPORTANT]")
    if not github and re.search(r"^\s*> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]", p, re.M):
        out.append(f"{where}: GitHub alert in a Jira draft; use lowercase md2adf callouts")
    return out


def lint_review(review):
    out = lint(review.get("body", ""), "body", True)
    comments = review.get("comments", [])
    for c in comments:
        where, body = f"{c.get('path')}:{c.get('line')}", c.get("body", "")
        out += lint(body, where, True)
        if not body.lstrip().startswith(LABELS):
            out.append(f"{where}: no label; start with one of {', '.join(LABELS)}")
        n = len([l for l in prose(body).splitlines() if l.strip()])
        if n > MAX_COMMENT_LINES:
            out.append(f"{where}: {n} prose lines, budget {MAX_COMMENT_LINES}; cut or move evidence into <details>")
    if sum(c.get("body", "").lstrip().startswith("**Question:**") for c in comments) > 1:
        out.append("review: more than one Question; keep the one that decides something")
    if len(comments) > 6:
        out.append(f"review: {len(comments)} comments; re-check each against the never-post list")
    return out


def selftest():
    good = {"body": "Thanks for the retry tests.\n\n1. **Errors are only logged** (`a.ts` line 3)",
            "comments": [{"path": "a.ts", "line": 3, "body":
                          "**Blocker:** a failed clean is only logged, so nothing reaches Sentry.\n\n"
                          "```suggestion\nSentry.captureException(error) // just \u2014 anything\n```\n"
                          "https://github.com/o/r/blob/" + "a" * 40 + "/a.ts#L3"}]}
    assert lint_review(good) == [], lint_review(good)
    bad = {"body": "Great news \u2014 see https://x.io/a/very/long", "comments": [
        {"path": "b.ts", "line": 1, "body": "You should simply fix this. > [!info] x"},
        {"path": "b.ts", "line": 2, "body": "**Question:** a?"}, {"path": "b.ts", "line": 3, "body": "**Question:** b?"}]}
    msgs = "\n".join(lint_review(bad))
    for want in ["em dash", "bare URL", "'great news'", "'simply'", "no label", "more than one Question"]:
        assert want in msgs, (want, msgs)
    jira = lint("**Fixed.** Job 123e4567-e89b-12d3-a456-426614174000 at 2026-11-20T09:14\n> [!NOTE]\n"
                "<https://github.com/o/r/pull/1>\n[PR](https://github.com/o/r/pull/1)", "md", False)
    assert [m.split(": ")[1] for m in jira] == ["UUID", "UTC timestamp", "GitHub alert in a Jira draft; use lowercase md2adf callouts"], jira
    fixtures()
    print("draft-lint selftest ok")


def fixtures():
    """tests/drafts/<name>.{md,gh.md,json} + <name>.expected (one substring per expected flag, empty = clean)."""
    root = pathlib.Path(__file__).resolve().parent.parent / "tests" / "drafts"
    for exp in sorted(root.glob("*.expected")):
        src = next(p for p in root.glob(exp.stem + ".*") if p.suffix != ".expected")
        text = src.read_text(encoding="utf-8")
        got = lint_review(json.loads(text)) if src.suffix == ".json" else lint(text, src.name, src.name.endswith(".gh.md"))
        want = [w for w in exp.read_text(encoding="utf-8").splitlines() if w.strip()]
        missing = [w for w in want if not any(w in g for g in got)]
        assert not missing and (want or not got), (src.name, missing, got)


if __name__ == "__main__":
    args = sys.argv[1:]
    if args == ["--selftest"]:
        selftest()
        sys.exit()
    github = "--github" in args
    paths = [a for a in args if a != "--github"]
    if len(paths) != 1:
        sys.exit(__doc__)
    src = open(paths[0], encoding="utf-8").read()
    problems = lint_review(json.loads(src)) if paths[0].endswith(".json") else lint(src, paths[0], github)
    print("\n".join(problems) or "draft-lint: clean")
    sys.exit(1 if problems else 0)
