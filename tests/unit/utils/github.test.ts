import { describe, expect, it } from "vitest";
import { createCommitUrl } from "@/lib/utils/github";

describe("GitHub Utilities", () => {
  describe("createCommitUrl", () => {
    it("should create commit URL from repo URL and hash", () => {
      const repoUrl = "https://github.com/user/repo";
      const commitHash = "abc123";
      const result = createCommitUrl(repoUrl, commitHash);
      expect(result).toBe("https://github.com/user/repo/commit/abc123");
    });

    it("should handle repo URLs with trailing slash", () => {
      const repoUrl = "https://github.com/user/repo/";
      const commitHash = "def456";
      const result = createCommitUrl(repoUrl, commitHash);
      expect(result).toBe("https://github.com/user/repo//commit/def456");
    });

    it("should handle different commit hash formats", () => {
      const repoUrl = "https://github.com/user/repo";
      const commitHash = "a1b2c3d4e5f6";
      const result = createCommitUrl(repoUrl, commitHash);
      expect(result).toBe("https://github.com/user/repo/commit/a1b2c3d4e5f6");
    });
  });
});
