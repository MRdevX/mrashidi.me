import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { format, parseISO, isValid } from "date-fns";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionGraphProps {
  data: ContributionDay[];
}

const getActivityLabel = (level: number): string => {
  if (level === 0) return "No activity";
  if (level === 1) return "Low activity";
  if (level === 2) return "Medium activity";
  if (level === 3) return "High activity";
  return "Very high activity";
};

const getActivityColor = (level: number): string => {
  switch (level) {
    case 0:
      return "bg-gray-800 hover:bg-gray-700";
    case 1:
      return "bg-green-900 hover:bg-green-800";
    case 2:
      return "bg-green-700 hover:bg-green-600";
    case 3:
      return "bg-green-500 hover:bg-green-400";
    case 4:
      return "bg-green-300 hover:bg-green-200";
    default:
      return "bg-gray-800 hover:bg-gray-700";
  }
};

const ContributionGraph = ({ data }: ContributionGraphProps) => {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    date: string;
    count: number;
    x: number;
    y: number;
  }>({
    visible: false,
    date: "",
    count: 0,
    x: 0,
    y: 0,
  });
  
  const tooltipRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const focusedCellRef = useRef<HTMLButtonElement | null>(null);
  
  // Generate days of the week for the y-axis labels
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Process data for display
  const processedData = data.reduce((acc: { [key: string]: ContributionDay }, day) => {
    acc[day.date] = day;
    return acc;
  }, {});
  
  // Organize data into a grid (7 rows for days of week, columns for weeks)
  const weeks: ContributionDay[][] = [];
  
  // Create a grid of the last 52 weeks
  if (data.length > 0) {
    // Sort data by date
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Get the latest date
    const latestDateStr = sortedData[sortedData.length - 1]?.date;
    const latestDate = isValid(parseISO(latestDateStr))
      ? parseISO(latestDateStr)
      : new Date();
    
    // Generate a 7x52 grid (days of week x weeks)
    for (let weekIndex = 51; weekIndex >= 0; weekIndex--) {
      const week: ContributionDay[] = [];
      
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        // Calculate the date for this position
        const dayOffset = weekIndex * 7 + dayIndex;
        const currentDate = new Date(latestDate);
        currentDate.setDate(latestDate.getDate() - dayOffset);
        
        const dateStr = format(currentDate, "yyyy-MM-dd");
        const contributionDay = processedData[dateStr] || {
          date: dateStr,
          count: 0,
          level: 0,
        };
        
        week.push(contributionDay);
      }
      
      weeks.unshift(week);
    }
  }
  
  // Handle keyboard navigation
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    e.preventDefault();
    
    if (e.key === "ArrowRight" && colIndex < weeks.length - 1) {
      const nextCell = document.getElementById(`cell-${rowIndex}-${colIndex + 1}`);
      nextCell?.focus();
    } else if (e.key === "ArrowLeft" && colIndex > 0) {
      const prevCell = document.getElementById(`cell-${rowIndex}-${colIndex - 1}`);
      prevCell?.focus();
    } else if (e.key === "ArrowUp" && rowIndex > 0) {
      const aboveCell = document.getElementById(`cell-${rowIndex - 1}-${colIndex}`);
      aboveCell?.focus();
    } else if (e.key === "ArrowDown" && rowIndex < 6) {
      const belowCell = document.getElementById(`cell-${rowIndex + 1}-${colIndex}`);
      belowCell?.focus();
    } else if (e.key === "Home") {
      const firstCell = document.getElementById(`cell-${rowIndex}-0`);
      firstCell?.focus();
    } else if (e.key === "End") {
      const lastCell = document.getElementById(`cell-${rowIndex}-${weeks.length - 1}`);
      lastCell?.focus();
    }
  };
  
  const showTooltip = (
    day: ContributionDay,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const graphRect = graphRef.current?.getBoundingClientRect();
    
    if (!graphRect) return;
    
    setTooltip({
      visible: true,
      date: day.date,
      count: day.count,
      x: rect.left - graphRect.left + rect.width / 2,
      y: rect.top - graphRect.top,
    });
  };
  
  const hideTooltip = () => {
    setTooltip((prev) => ({ ...prev, visible: false }));
  };
  
  // Adjust tooltip position when it changes
  useEffect(() => {
    if (tooltip.visible && tooltipRef.current) {
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const tooltipHeight = tooltipRef.current.offsetHeight;
      
      // Adjust horizontal position to keep tooltip within container
      tooltipRef.current.style.left = `${Math.max(
        0,
        Math.min(
          tooltip.x - tooltipWidth / 2,
          (graphRef.current?.offsetWidth || 0) - tooltipWidth
        )
      )}px`;
      
      // Position above the cell
      tooltipRef.current.style.top = `${Math.max(
        0,
        tooltip.y - tooltipHeight - 10
      )}px`;
    }
  }, [tooltip]);
  
  return (
    <div
      className="glass-card p-6 overflow-hidden relative"
      ref={graphRef}
      aria-label="GitHub contribution activity graph"
      role="region"
    >
      <h3 className="text-lg font-semibold text-orange-500 mb-4">Contribution Activity</h3>
      
      <div className="flex overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {/* Days of week labels (y-axis) */}
        <div className="flex flex-col mr-2 pt-8">
          {daysOfWeek.map((day, index) => (
            <div
              key={day}
              className="h-4 text-xs text-gray-500 flex items-center mb-1"
              aria-hidden="true"
            >
              {index % 2 === 0 ? day : ""}
            </div>
          ))}
        </div>
        
        {/* Contribution grid */}
        <div>
          {/* Months labels (x-axis) */}
          <div className="flex mb-1">
            {weeks.map((week, weekIndex) => {
              const date = parseISO(week[0].date);
              const isFirstOfMonth = date.getDate() <= 7;
              const showMonth = isFirstOfMonth || weekIndex === 0;
              
              return (
                <div
                  key={weekIndex}
                  className="w-4 text-xs text-gray-500 text-center"
                  style={{ height: "20px" }}
                  aria-hidden="true"
                >
                  {showMonth ? format(date, "MMM") : ""}
                </div>
              );
            })}
          </div>
          
          {/* Grid cells */}
          <div className="flex">
            <div>
              {[0, 1, 2, 3, 4, 5, 6].map((rowIndex) => (
                <div key={rowIndex} className="flex mb-2">
                  {weeks.map((week, colIndex) => {
                    const day = week[rowIndex];
                    const activityLevel = getActivityLabel(day.level);
                    const formattedDate = format(
                      parseISO(day.date),
                      "MMMM d, yyyy"
                    );
                    
                    return (
                      <button
                        id={`cell-${rowIndex}-${colIndex}`}
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-5 h-5 rounded-sm m-0.5 ${getActivityColor(
                          day.level
                        )} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-gray-900 focus:ring-orange-500`}
                        aria-label={`${formattedDate}: ${day.count} contributions, ${activityLevel}`}
                        role="gridcell"
                        onMouseEnter={(e) => showTooltip(day, e)}
                        onMouseLeave={hideTooltip}
                        onFocus={(e) => {
                          focusedCellRef.current = e.currentTarget;
                          showTooltip(day, e as unknown as React.MouseEvent<HTMLButtonElement>);
                        }}
                        onBlur={() => {
                          focusedCellRef.current = null;
                          hideTooltip();
                        }}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                        tabIndex={0}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Activity level legend */}
      <div className="flex items-center justify-end mt-4">
        <span className="text-xs text-gray-500 mr-2">Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`w-5 h-5 rounded-sm m-0.5 ${getActivityColor(level)} mr-1`}
            aria-label={getActivityLabel(level)}
          />
        ))}
        <span className="text-xs text-gray-500">More</span>
      </div>
      
      {/* Tooltip */}
      {tooltip.visible && (
        <motion.div
          ref={tooltipRef}
          className="absolute bg-gray-900 text-white text-xs p-2 rounded-md shadow-lg pointer-events-none z-10 border border-gray-700"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          role="tooltip"
          aria-hidden="true"
        >
          <div className="font-medium">{format(parseISO(tooltip.date), "MMMM d, yyyy")}</div>
          <div>
            {tooltip.count} contribution{tooltip.count !== 1 ? "s" : ""}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ContributionGraph;
