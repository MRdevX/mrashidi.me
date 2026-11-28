# Flatten Atlassian Document Format (ADF) to readable plain text.
def adf2text:
  def walk:
    if type == "object" then
      if .type == "text" then
        (.text // "")
        + (if (.marks // []) | any(.type == "code") then "" else "" end)
      elif .type == "hardBreak" then "\n"
      elif .type == "paragraph" then ((.content // []) | map(walk) | join("")) + "\n\n"
      elif .type == "heading" then
        ("#" * (.attrs.level // 1)) + " " + ((.content // []) | map(walk) | join("")) + "\n\n"
      elif .type == "bulletList" then ((.content // []) | map(walk) | join("")) + "\n"
      elif .type == "orderedList" then ((.content // []) | map(walk) | join("")) + "\n"
      elif .type == "listItem" then "- " + (((.content // []) | map(walk) | join("")) | gsub("\n+$";"")) + "\n"
      elif .type == "codeBlock" then "```\n" + ((.content // []) | map(walk) | join("")) + "\n```\n\n"
      elif .type == "blockquote" then "> " + (((.content // []) | map(walk) | join("")) | gsub("\n+$";"")) + "\n\n"
      elif .type == "rule" then "---\n\n"
      elif .type == "mediaSingle" or .type == "mediaGroup" then ((.content // []) | map(walk) | join(""))
      elif .type == "media" then "[image: " + (.attrs.alt // .attrs.id // "attachment") + "]\n\n"
      elif .type == "mention" then (.attrs.text // .attrs.id // "someone") | (if startswith("@") then . else "@" + . end)
      elif .type == "inlineCard" or .type == "blockCard" then "<" + (.attrs.url // "link") + ">"
      elif .type == "emoji" then (.attrs.text // .attrs.shortName // "")
      elif .type == "status" then "[" + (.attrs.text // "") + "]"
      elif .type == "date" then (.attrs.timestamp // "")
      elif .type == "table" then ((.content // []) | map(walk) | join("")) + "\n"
      elif .type == "tableRow" then "| " + ((.content // []) | map(walk) | join(" | ")) + " |\n"
      elif (.type == "tableCell" or .type == "tableHeader") then
        (((.content // []) | map(walk) | join(" ")) | gsub("\n+";" ") | gsub("^ +| +$";""))
      elif .type == "panel" then "[" + ((.attrs.panelType // "note") | ascii_upcase) + "] " + (((.content // []) | map(walk) | join("")) | gsub("\n+$";"")) + "\n\n"
      elif .type == "expand" or .type == "nestedExpand" then
        "<details: " + (.attrs.title // "") + ">\n" + ((.content // []) | map(walk) | join("")) + "</details>\n\n"
      elif .type == "doc" then ((.content // []) | map(walk) | join(""))
      else ((.content // []) | map(walk) | join(""))
      end
    elif type == "array" then (map(walk) | join(""))
    elif type == "string" then .
    else "" end;
  if . == null then "" else (walk | gsub("\n{3,}";"\n\n") | gsub("^\\s+|\\s+$";"")) end;
