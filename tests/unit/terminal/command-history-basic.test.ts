import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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

  it("walks backward through history on repeated up presses", () => {
    const commandHistory = ["help", "about", "skills"];
    const { result } = renderHook(() => useCommandHistory(commandHistory));

    act(() => {
      expect(result.current.navigateHistory("up", "")).toBe("skills");
    });
    act(() => {
      expect(result.current.navigateHistory("up", "")).toBe("about");
    });
    act(() => {
      expect(result.current.navigateHistory("up", "")).toBe("help");
    });
  });

  it("navigates down toward newer commands then clears input at bottom", () => {
    const commandHistory = ["help", "about", "skills"];
    const { result } = renderHook(() => useCommandHistory(commandHistory));

    act(() => {
      result.current.navigateHistory("up", "");
    });
    act(() => {
      result.current.navigateHistory("up", "");
    });
    expect(result.current.historyPosition).toBe(1);

    act(() => {
      expect(result.current.navigateHistory("down", "")).toBe("skills");
    });

    act(() => {
      expect(result.current.navigateHistory("down", "")).toBe("");
    });
    expect(result.current.historyPosition).toBe(-1);
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
