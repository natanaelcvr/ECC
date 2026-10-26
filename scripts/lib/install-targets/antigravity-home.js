const { createInstallTargetAdapter } = require('./helpers');
const { planAntigravityOperations } = require('./antigravity-project');

const adapter = createInstallTargetAdapter({
  id: 'antigravity-home',
  target: 'antigravity-home',
  kind: 'home',
  rootSegments: ['.gemini', 'config', 'plugins', 'ecc'],
  installStatePathSegments: ['ecc-install-state.json'],
  supportsModule(module) {
    const paths = Array.isArray(module && module.paths) ? module.paths : [];
    return paths.length > 0;
  },
  planOperations(input, targetAdapter) {
    return planAntigravityOperations(input, targetAdapter);
  },
});

module.exports = adapter;
