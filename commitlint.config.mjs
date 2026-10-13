/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-empty": [2, "always"],
    "footer-empty": [2, "always"],
  },
  ignores: [(message) => message.includes("Signed-off-by: dependabot[bot]")],
};
