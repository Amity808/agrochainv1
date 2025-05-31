export default {
  // ... your existing config
  onwarn(warning, warn) {
    if (
      warning.code === 'PLUGIN_WARNING' && 
      warning.message.includes('contains an annotation that Rollup cannot interpret')
    ) {
      return; // Ignore pure-comment warnings
    }
    warn(warning); // Preserve other warnings
  }
};