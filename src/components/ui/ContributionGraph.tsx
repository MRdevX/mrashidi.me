import React from "react";

const ContributionGraph = () => {
  return (
    <div className="glass-card p-4 lg:p-6 overflow-hidden relative w-full">
      <h3 className={`text-lg font-semibold text-orange-500 mb-4`}>Contribution Activity</h3>
      <iframe
        frameBorder="0"
        height="142px"
        width="802px"
        src="https://git-graph.vercel.app/embed/MRdevX?showColorLegend=false&showWeekdayLabels=true&showMonthLabels=true&showTotalCount=false&blockMargin=2&blockRadius=2&blockSize=12&fontSize=14&weekStart=0&year=2025"
        title="GitHub Contribution Graph"
        className="w-full"
      />
    </div>
  );
};

export { ContributionGraph };
