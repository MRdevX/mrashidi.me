import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCommandHistory } from "@/components/terminal/hooks/useCommandHistory";

describe("useCommandHistory - Basic Functionality", () => {
  it("should initialize with empty history position", () => {
    const { result } = renderHook(() => useCommandHistory([]));

    expect(result.current.historyPosition).toBe(-1);
    expect(typeof result.current.navigateHistory).toBe("function");
    expect(typeof result.current.resetHistoryPosition).toBe("function");
  });

  it("should return current input when history is empty", () => {
    const { result } = renderHook(() => useCommandHistory([]));

    act(() => {
      const newInput = result.current.navigateHistory("up", "current input");
      expect(newInput).toBe("current input");
    });
  });

  it("should navigate up through command history", () => {
    const commandHistory = ["help", "about", "skills"];
    const { result } = renderHook(() => useCommandHistory(commandHistory));

    act(() => {
      const input1 = result.current.navigateHistory("up", "");
      expect(input1).toBe("skills");
    });
  });

  it("should handle navigation down", () => {
    const commandHistory = ["help", "about", "skills"];
    const { result } = renderHook(() => useCommandHistory(commandHistory));

    act(() => {
      const input1 = result.current.navigateHistory("down", "current input");
      expect(input1).toBe("current input");
    });
  });

  it("should reset history position", () => {
    const commandHistory = ["help", "about", "skills"];
    const { result } = renderHook(() => useCommandHistory(commandHistory));

    act(() => {
      result.current.navigateHistory("up", "");
    });

    act(() => {
      result.current.resetHistoryPosition();
    });

    expect(result.current.historyPosition).toBe(-1);
  });
});
