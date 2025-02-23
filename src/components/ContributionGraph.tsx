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

  // Group days into weeks
  data.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

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
      <div className="w-full overflow-x-auto">
        <div className="min-w-max">
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
                        className={`w-3 h-3 rounded-sm ${getLevelColor(
                          day.level,
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
          <div className="flex justify-start mt-4 text-sm text-gray-400 gap-4 items-center">
            <span className="font-medium">Contribution Level:</span>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4].map((level) => (
                <Tooltip.Root key={level} delayDuration={0}>
                  <Tooltip.Trigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className={`w-3 h-3 rounded-sm ${getLevelColor(level, true)} cursor-help`}
                    />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className="bg-gray-900 text-white px-2 py-1 rounded-md text-xs" sideOffset={5}>
                      {level === 0
                        ? "No contributions"
                        : level === 1
                        ? "1-2 contributions"
                        : level === 2
                        ? "3-4 contributions"
                        : level === 3
                        ? "5-6 contributions"
                        : "7+ contributions"}
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
};

export default ContributionGraph;
