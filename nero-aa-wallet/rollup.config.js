export default {
  // ... existing config ...
  onwarn(warning, warn) {
    if (warning.code === "PURE_COMMENT") return; // Ignore PURE_COMMENT warnings
    warn(warning);
  },
};
