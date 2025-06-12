import React from "react";

const ContributionGraph = () => {
  return (
    <div className="glass-card p-4 lg:p-6 overflow-hidden relative w-full">
      <h3 className="text-lg font-semibold text-orange-500 mb-4">Contribution Activity</h3>
      <iframe
        frameBorder="0"
        height="186px"
        width="100%"
        src="https://git-graph.vercel.app/embed/mrdevx?showColorLegend=true&showWeekdayLabels=true&showMonthLabels=true&showTotalCount=true&blockMargin=3&blockRadius=3&blockSize=14&fontSize=12&weekStart=0&year=2025"
        title="GitHub Contribution Graph"
        className="w-full"
      />
    </div>
  );
};

export default ContributionGraph;
