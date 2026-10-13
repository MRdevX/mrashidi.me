"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { trackAskMr } from "../../client/analytics";
import { useAskMr } from "../AskMrProvider";
import { CardShell, cardButtonClass } from "./CardShell";

export function CvCard({ resumePath, onNavigate }: { resumePath: string; onNavigate: () => void }) {
  const { openCvRequest } = useAskMr();

  return (
    <CardShell title="CV">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={cardButtonClass}
          onClick={() => {
            trackAskMr("ask_mr_tool_click", { tool: "requestCv" });
            openCvRequest();
          }}
        >
          <FileText className="size-4" aria-hidden />
          Get the CV
        </button>
        <Link href={resumePath} className={cardButtonClass} onClick={onNavigate}>
          View résumé page
        </Link>
      </div>
    </CardShell>
  );
}
