import { useState, useCallback } from "react";

export const useCommandHistory = (commandHistory: string[]) => {
  const [historyPosition, setHistoryPosition] = useState(-1);

  const navigateHistory = useCallback(
    (direction: "up" | "down", currentInput: string) => {
      if (commandHistory.length === 0) return currentInput;

      if (direction === "up") {
        const newPosition = Math.min(historyPosition + 1, commandHistory.length - 1);
        setHistoryPosition(newPosition);
        return commandHistory[commandHistory.length - 1 - newPosition];
      } else {
        if (historyPosition > 0) {
          const newPosition = historyPosition - 1;
          setHistoryPosition(newPosition);
          return commandHistory[commandHistory.length - 1 - newPosition];
        } else if (historyPosition === 0) {
          setHistoryPosition(-1);
          return "";
        }
      }
      return currentInput;
    },
    [commandHistory, historyPosition]
  );

  const resetHistoryPosition = useCallback(() => {
    setHistoryPosition(-1);
  }, []);

  return {
    historyPosition,
    navigateHistory,
    resetHistoryPosition,
  };
};
