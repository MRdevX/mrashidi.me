#!/usr/bin/env python3
"""Convert the Markdown subset used in mr-* drafts to Jira ADF JSON.

    python3 md2adf.py draft.md > body.json     # or - for stdin
    python3 md2adf.py --selftest

Supported: paragraphs, headings, **bold**, *em*, `code`, [links](url), bullet and
numbered lists (one nesting level), pipe tables, fenced code, --- rules, and callouts:

    > [!info] / [!note] / [!success] / [!warning] / [!error]   -> panel
    > [!panel #DEEBFF]                                         -> custom-colour panel
    > [!expand] Title                                          -> expand (collapsed section)
    <https://github.com/o/r/pull/1>   (alone on a line)        -> smart link card
    @[Display Name](accountId)                                -> mention (notifies)

Anything it cannot place in valid ADF fails loudly instead of posting a flat wall of text.
"""
import json
import re
import sys

PANELS = {"info", "note", "success", "warning", "error"}
# ADF panels only hold these; a table in a panel is rejected by Jira.
PANEL_OK = {"paragraph", "heading", "bulletList", "orderedList", "codeBlock", "rule"}

INLINE = re.compile(
    r"`(?P<code>[^`]+)`"
    r"|@\[(?P<mname>[^\]]+)\]\((?P<mid>[^)\s]+)\)"
    r"|\*\*(?P<strong>.+?)\*\*"
    r"|\[(?P<ltext>[^\]]+)\]\((?P<href>[^)\s]+)\)"
    r"|(?<![\w*])\*(?!\s)(?P<em>.+?)(?<!\s)\*(?![\w*])"
    r"|(?<!\w)_(?!\s)(?P<em2>.+?)(?<!\s)_(?!\w)"
)
BULLET = re.compile(r"^(\s*)[-*] +(.*)$")
NUMBER = re.compile(r"^(\s*)(\d+)\. +(.*)$")
CALLOUT = re.compile(r"^\[!(\w+)(?: +(#[0-9A-Fa-f]{6}))?\]\s*(.*)$")


def text(s, marks):
    node = {"type": "text", "text": s}
    if marks:
        node["marks"] = [dict(m) for m in marks]
    return node


def inline(s, marks=()):
    out, pos = [], 0
    for m in INLINE.finditer(s):
        if m.start() > pos:
            out.append(text(s[pos:m.start()], marks))
        if m["code"] is not None:
            # ADF: code only combines with link.
            out.append(text(m["code"], [x for x in marks if x["type"] == "link"] + [{"type": "code"}]))
        elif m["mname"] is not None:
            # Mention: notifies the person. accountId from Atlassian MCP lookupJiraAccountId.
            out.append({"type": "mention", "attrs": {"id": m["mid"], "text": "@" + m["mname"]}})
        elif m["strong"] is not None:
            out += inline(m["strong"], (*marks, {"type": "strong"}))
        elif m["ltext"] is not None:
            out += inline(m["ltext"], (*marks, {"type": "link", "attrs": {"href": m["href"]}}))
        else:
            out += inline(m["em"] or m["em2"], (*marks, {"type": "em"}))
        pos = m.end()
    if pos < len(s):
        out.append(text(s[pos:], marks))
    return out


def para(s):
    content = inline(s.strip())
    return {"type": "paragraph", "content": content} if content else {"type": "paragraph"}


def cells(line):
    parts = re.split(r"(?<!\\)\|", line.strip().strip("|"))
    return [p.strip().replace("\\|", "|") for p in parts]


def table(rows):
    if len(rows) < 2 or not re.fullmatch(r"[\s|:-]+", rows[1]):
        raise ValueError(f"table needs a header and a |---| separator row: {rows[0]!r}")
    body = [rows[0]] + rows[2:]
    width = len(cells(rows[0]))
    out = []
    for i, r in enumerate(body):
        cs = cells(r)
        if len(cs) != width:
            raise ValueError(f"table row has {len(cs)} cells, header has {width}: {r!r}")
        kind = "tableHeader" if i == 0 else "tableCell"
        out.append({"type": "tableRow", "content": [
            {"type": kind, "attrs": {}, "content": [para(c)]} for c in cs]})
    return {"type": "table", "attrs": {"isNumberColumnEnabled": False, "layout": "default"}, "content": out}


def blocks(lines, in_panel=False):
    out, i = [], 0
    while i < len(lines):
        line = lines[i]
        s = line.strip()
        if not s:
            i += 1
        elif s.startswith("```"):
            lang, body, i = s[3:].strip(), [], i + 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                body.append(lines[i])
                i += 1
            if i == len(lines):
                raise ValueError("unclosed ``` code fence")
            i += 1
            node = {"type": "codeBlock", "content": [{"type": "text", "text": "\n".join(body)}]}
            if lang:
                node["attrs"] = {"language": lang}
            out.append(node)
        elif re.fullmatch(r"-{3,}", s):
            out.append({"type": "rule"})
            i += 1
        elif m := re.match(r"^(#{1,6}) +(.*)$", s):
            out.append({"type": "heading", "attrs": {"level": len(m[1])}, "content": inline(m[2])})
            i += 1
        elif s.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append(lines[i])
                i += 1
            out.append(table(rows))
        elif s.startswith(">"):
            inner = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                inner.append(re.sub(r"^\s*> ?", "", lines[i]))
                i += 1
            out.append(callout(inner))
        elif BULLET.match(line) or NUMBER.match(line):
            items, numbered = [], bool(NUMBER.match(line))
            while i < len(lines) and lines[i].strip() and (
                    BULLET.match(lines[i]) or NUMBER.match(lines[i]) or lines[i].startswith(" ")):
                top = not lines[i].startswith("  ")
                if top and items and bool(NUMBER.match(lines[i])) != numbered:
                    break  # bullets switching to numbers (or back) starts a new list
                items.append(lines[i])
                i += 1
            out.append(list_node(items))
        elif m := re.fullmatch(r"<(https?://\S+)>", s):
            # Smart link: Jira shows the PR/ticket title and status instead of the URL.
            out.append({"type": "paragraph", "content": [{"type": "inlineCard", "attrs": {"url": m[1]}}]})
            i += 1
        else:
            buf = []
            while i < len(lines) and lines[i].strip() and not starts_block(lines[i]):
                buf.append(lines[i].strip())
                i += 1
            # A single newline stays a line break, the way Jira's own editor treats it.
            content = []
            for n, b in enumerate(buf):
                content += ([{"type": "hardBreak"}] if n else []) + inline(b)
            out.append({"type": "paragraph", "content": content})
    if in_panel:
        bad = {n["type"] for n in out} - PANEL_OK
        if bad:
            raise ValueError(f"Jira panels cannot hold {sorted(bad)}; use [!expand] or move it out")
    return out


def starts_block(line):
    s = line.strip()
    return (s.startswith(("```", "|", ">")) or re.match(r"#{1,6} ", s) or re.fullmatch(r"-{3,}", s)
            or BULLET.match(line) or NUMBER.match(line))


def list_node(lines):
    """Bullet/numbered list with one nesting level (children indented 2+ spaces)."""
    first = NUMBER.match(lines[0])
    node = {"type": "orderedList" if first else "bulletList", "content": []}
    if first and first[2] != "1":
        node["attrs"] = {"order": int(first[2])}
    items = []  # [text, [child lines]]
    for line in lines:
        m = BULLET.match(line) or NUMBER.match(line)
        if m and len(m[1]) < 2:
            items.append([m.groups()[-1], []])
        elif not items:
            raise ValueError(f"indented line before any list item: {line!r}")
        elif m:
            items[-1][1].append(line.lstrip())
        elif items[-1][1]:
            items[-1][1][-1] += " " + line.strip()
        else:
            items[-1][0] += " " + line.strip()
    for t, kids in items:
        content = [para(t)]
        if kids:
            content.append(list_node(kids))
        node["content"].append({"type": "listItem", "content": content})
    return node


def callout(lines):
    m = CALLOUT.match(lines[0].strip()) if lines else None
    if not m:
        return {"type": "blockquote", "content": blocks(lines)}
    kind, colour, rest = m[1].lower(), m[2], m[3].strip()
    body = lines[1:]
    if kind == "expand":
        return {"type": "expand", "attrs": {"title": rest}, "content": blocks(body)}
    if kind == "panel":
        if not colour:
            raise ValueError("[!panel] needs a colour, like [!panel #DEEBFF]")
        return {"type": "panel", "attrs": {"panelType": "custom", "panelColor": colour},
                "content": blocks(body, in_panel=True)}
    if kind in PANELS:
        if rest:
            body = [rest] + body
        return {"type": "panel", "attrs": {"panelType": kind}, "content": blocks(body, in_panel=True)}
    raise ValueError(f"unknown callout [!{m[1]}]; use one of {sorted(PANELS | {'panel', 'expand'})}")


def convert(md):
    return {"version": 1, "type": "doc", "content": blocks(md.splitlines())}


SAMPLE = """\
**Tested on staging:** works ✅ for [ABC-1](https://x/browse/ABC-1).

## Status

| Check | Staging | Prod |
| --- | --- | --- |
| Reminder `sent` | ✅ | ⏳ |
| Pipe \\| escaped | *yes* | no |

- one
- two with **bold [link](https://l)**
  - nested
3. three
4. four

> [!success]
> 1. criterion one
> 2. criterion two

> [!panel #DEEBFF]
> *As a patient I want x so y*

> [!expand] Details
> | a | b |
> | --- | --- |
> | 1 | 2 |

```bash
yarn test
```

---
plain _em_ end
#8618 is not a heading
"""


def selftest():
    d = convert(SAMPLE)
    types = [n["type"] for n in d["content"]]
    assert types == ["paragraph", "heading", "table", "bulletList", "orderedList", "panel", "panel",
                     "expand", "codeBlock", "rule", "paragraph"], types
    p0 = d["content"][0]["content"]
    assert p0[0] == {"type": "text", "text": "Tested on staging:", "marks": [{"type": "strong"}]}, p0
    assert p0[2]["marks"][0]["attrs"]["href"] == "https://x/browse/ABC-1"
    tbl = d["content"][2]["content"]
    assert [c["type"] for c in tbl[0]["content"]] == ["tableHeader"] * 3
    assert len(tbl) == 3 and tbl[1]["content"][0]["content"][0]["content"][1]["marks"] == [{"type": "code"}]
    assert tbl[2]["content"][0]["content"][0]["content"][0]["text"] == "Pipe | escaped"
    bl = d["content"][3]["content"]
    assert len(bl) == 2 and bl[1]["content"][1]["type"] == "bulletList", bl
    bold_link = bl[1]["content"][0]["content"][2]
    assert {m["type"] for m in bold_link["marks"]} == {"strong", "link"}, bold_link
    assert d["content"][4]["attrs"] == {"order": 3}
    ok = d["content"][5]
    assert ok["attrs"] == {"panelType": "success"} and ok["content"][0]["type"] == "orderedList"
    assert d["content"][6]["attrs"] == {"panelType": "custom", "panelColor": "#DEEBFF"}
    assert d["content"][6]["content"][0]["content"][0]["marks"] == [{"type": "em"}]
    assert d["content"][7]["attrs"]["title"] == "Details" and d["content"][7]["content"][0]["type"] == "table"
    assert d["content"][8]["attrs"] == {"language": "bash"}
    assert d["content"][10]["content"][1]["marks"] == [{"type": "em"}]
    last = d["content"][10]["content"]
    assert last[-2] == {"type": "hardBreak"} and last[-1]["text"] == "#8618 is not a heading", last
    men = convert("**Need a decision:** @[Ana B](5b10ac) A or B?")["content"][0]["content"]
    assert men[2] == {"type": "mention", "attrs": {"id": "5b10ac", "text": "@Ana B"}}, men
    card = convert("<https://github.com/o/r/pull/1>")["content"][0]["content"][0]
    assert card == {"type": "inlineCard", "attrs": {"url": "https://github.com/o/r/pull/1"}}, card
    for bad in ["> [!info]\n> | a |\n> | - |", "> [!tip]\n> x", "| a | b |\n| - | - |\n| 1 |", "```\nx"]:
        try:
            convert(bad)
        except ValueError:
            continue
        raise AssertionError(f"should have failed: {bad!r}")
    print("md2adf selftest ok")


if __name__ == "__main__":
    if sys.argv[1:] == ["--selftest"]:
        selftest()
    elif len(sys.argv) == 2:
        src = sys.stdin.read() if sys.argv[1] == "-" else open(sys.argv[1], encoding="utf-8").read()
        try:
            print(json.dumps(convert(src), ensure_ascii=False, indent=1))
        except ValueError as e:
            sys.exit(f"md2adf: {e}")
    else:
        sys.exit(__doc__)
