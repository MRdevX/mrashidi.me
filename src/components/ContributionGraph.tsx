import { motion, AnimatePresence } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionGraphProps {
  data: ContributionDay[];
}

const ContributionGraph: React.FC<ContributionGraphProps> = ({ data }) => {
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];

  // Calculate contribution statistics
  const totalContributions = data.reduce((sum, day) => sum + day.count, 0);
  const contributingDays = data.filter((day) => day.count > 0).length;
  const bestDay = data.reduce((best, day) => (day.count > best.count ? day : best), data[0]);
  const currentStreak = (() => {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].count > 0) streak++;
      else break;
    }
    return streak;
  })();

  // Fill data for exactly 6 months
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 6);

  // Calculate weeks needed (26 weeks = 6 months)
  const daysNeeded = 26 * 7;
  const currentDays = data.length;

  if (currentDays < daysNeeded) {
    const additionalDays = daysNeeded - currentDays;
    const fillerDays: ContributionDay[] = Array.from({ length: additionalDays }, (_, i) => {
      const date = new Date(sixMonthsAgo);
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString().split("T")[0],
        count: 0,
        level: 0,
      };
    });
    data = [...fillerDays, ...data].slice(-daysNeeded);
  }

  // Group days into weeks
  data.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getContributionLevel = (count: number): number => {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 10) return 3;
    return 4;
  };

  const getLevelColor = (level: number, isDark: boolean): string => {
    if (isDark) {
      switch (level) {
        case 0:
          return "bg-gray-800 hover:bg-gray-700";
        case 1:
          return "bg-emerald-900 hover:bg-emerald-800";
        case 2:
          return "bg-emerald-700 hover:bg-emerald-600";
        case 3:
          return "bg-emerald-500 hover:bg-emerald-400";
        case 4:
          return "bg-emerald-300 hover:bg-emerald-200";
        default:
          return "bg-gray-800 hover:bg-gray-700";
      }
    } else {
      switch (level) {
        case 0:
          return "bg-gray-100 hover:bg-gray-200";
        case 1:
          return "bg-emerald-200 hover:bg-emerald-300";
        case 2:
          return "bg-emerald-300 hover:bg-emerald-400";
        case 3:
          return "bg-emerald-400 hover:bg-emerald-500";
        case 4:
          return "bg-emerald-500 hover:bg-emerald-600";
        default:
          return "bg-gray-100 hover:bg-gray-200";
      }
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getContributionText = (count: number): string => {
    if (count === 0) return "No contributions";
    if (count === 1) return "1 contribution";
    return `${count} contributions`;
  };

  return (
    <Tooltip.Provider delayDuration={0}>
      <div className="w-full space-y-6">
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Month Labels */}
            <div className="flex mb-2">
              <div className="w-8" /> {/* Offset for day labels */}
              {Array.from({ length: 6 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - 5 + i);
                return (
                  <div key={i} className="flex-1 text-xs text-gray-400">
                    {date.toLocaleDateString("en-US", { month: "short" })}
                  </div>
                );
              })}
            </div>

            {/* Contribution Grid with Day Labels */}
            <div className="flex">
              {/* Day Labels */}
              <div className="flex flex-col gap-1 mr-2 text-xs text-gray-400 justify-between py-1">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>

              {/* Contribution Squares */}
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <Tooltip.Root key={day.date}>
                        <Tooltip.Trigger asChild>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.2 }}
                            transition={{
                              duration: 0.2,
                              delay: (weekIndex * 7 + dayIndex) * 0.01,
                            }}
                            className={`w-4 h-4 rounded-sm ${getLevelColor(
                              getContributionLevel(day.count),
                              true
                            )} cursor-pointer transition-all duration-200`}
                          />
                        </Tooltip.Trigger>
                        <AnimatePresence>
                          <Tooltip.Portal>
                            <Tooltip.Content
                              className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm z-50"
                              sideOffset={5}
                              asChild
                            >
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                              >
                                <div className="font-medium">{formatDate(day.date)}</div>
                                <div className="text-gray-300">{getContributionText(day.count)}</div>
                                <Tooltip.Arrow className="fill-gray-900" />
                              </motion.div>
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </AnimatePresence>
                      </Tooltip.Root>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-start mt-4 text-sm text-gray-400 gap-4 items-center">
              <span className="font-medium">Contribution Level:</span>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4].map((level) => (
                  <Tooltip.Root key={level} delayDuration={0}>
                    <Tooltip.Trigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className={`w-4 h-4 rounded-sm ${getLevelColor(level, true)} cursor-help`}
                      />
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                      <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded-md text-xs" sideOffset={5}>
                        {level === 0
                          ? "No contributions"
                          : level === 1
                          ? "1-3 contributions"
                          : level === 2
                          ? "4-6 contributions"
                          : level === 3
                          ? "7-10 contributions"
                          : "10+ contributions"}
                        <Tooltip.Arrow className="fill-gray-900" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-700">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800 p-4 rounded-lg">
            <div className="text-gray-400 text-sm">Total Contributions</div>
            <div className="text-2xl font-bold text-white">{totalContributions}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 p-4 rounded-lg"
          >
            <div className="text-gray-400 text-sm">Contributing Days</div>
            <div className="text-2xl font-bold text-white">{contributingDays}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 p-4 rounded-lg"
          >
            <div className="text-gray-400 text-sm">Current Streak</div>
            <div className="text-2xl font-bold text-white">{currentStreak} days</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 p-4 rounded-lg"
          >
            <div className="text-gray-400 text-sm">Best Day</div>
            <div className="text-2xl font-bold text-white">{bestDay.count} contributions</div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(bestDay.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          </motion.div>
        </div>
      </div>
    </Tooltip.Provider>
  );
};

export default ContributionGraph;
