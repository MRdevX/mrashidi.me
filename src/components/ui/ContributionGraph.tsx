import React from "react";

const ContributionGraph = React.memo(() => {
  return (
    <div className="glass-card-no-shadow p-4 lg:p-6 overflow-hidden relative w-full border border-orange-500/10 rounded-xl shadow-lg">
      <h3 className={`text-lg font-semibold text-orange-500 mb-4`}>Contribution Activity</h3>
      <div className="relative z-10 bg-transparent">
        <iframe
          frameBorder="0"
          height="142px"
          width="802px"
          src="https://git-graph.vercel.app/embed/MRdevX?showColorLegend=false&showWeekdayLabels=true&showMonthLabels=true&showTotalCount=false&blockMargin=2&blockRadius=2&blockSize=12&fontSize=14&weekStart=0&year=2025"
          title="GitHub Contribution Graph"
          className="w-full bg-transparent"
          style={{ backgroundColor: "transparent" }}
        />
      </div>
    </div>
  );
});

ContributionGraph.displayName = "ContributionGraph";

export { ContributionGraph };
