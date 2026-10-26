'use strict';

const { validateInstallModuleIds, LOCALE_ALIAS_TO_COMPONENT_ID, listSupportedLocales } = require('../install-manifests');
const { resolveHookConsentFlags } = require('./hook-consent');

const LEGACY_INSTALL_TARGETS = ['claude', 'claude-project', 'cursor', 'antigravity'];
const LOCALE_COMPONENT_IDS = new Set(Object.values(LOCALE_ALIAS_TO_COMPONENT_ID));

function dedupeStrings(values) {
  return [...new Set((Array.isArray(values) ? values : []).map(value => String(value).trim()).filter(Boolean))];
}

function normalizeSkillComponentIds(rawValue) {
  return dedupeStrings(String(rawValue || '').split(',')).map(value => (
    value.startsWith('skill:') ? value : `skill:${value}`
  ));
}

function parseInstallArgs(argv) {
  const args = argv.slice(2);
  const profileIds = [];
  const parsed = {
    target: null,
    dryRun: false,
    json: false,
    help: false,
    configPath: null,
    profileId: null,
    profileIds: [],
    moduleIds: [],
    includeComponentIds: [],
    excludeComponentIds: [],
    languages: [],
    locale: null,
    enableHooks: false,
    noHooks: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === '--target') {
      parsed.target = args[index + 1] || null;
      index += 1;
    } else if (arg === '--config') {
      parsed.configPath = args[index + 1] || null;
      index += 1;
    } else if (arg === '--profile' || arg === '--profiles') {
      while (index + 1 < args.length && !args[index + 1].startsWith('--')) {
        const raw = args[index + 1] || '';
        if (raw.trim()) {
          profileIds.push(...raw.split(','));
        }
        index += 1;
      }
    } else if (arg === '--modules') {
      while (index + 1 < args.length && !args[index + 1].startsWith('--')) {
        const raw = args[index + 1] || '';
        if (raw.trim()) {
          parsed.moduleIds.push(...dedupeStrings(raw.split(',')));
        }
        index += 1;
      }
      parsed.moduleIds = dedupeStrings(parsed.moduleIds);
    } else if (arg === '--with') {
      const componentId = args[index + 1] || '';
      if (componentId.trim()) {
        parsed.includeComponentIds.push(componentId.trim());
      }
      index += 1;
    } else if (arg === '--skill' || arg === '--skills') {
      parsed.includeComponentIds.push(...normalizeSkillComponentIds(args[index + 1] || ''));
      index += 1;
    } else if (arg === '--without') {
      const componentId = args[index + 1] || '';
      if (componentId.trim()) {
        parsed.excludeComponentIds.push(componentId.trim());
      }
      index += 1;
    } else if (arg === '--locale') {
      const locale = args[index + 1] || '';
      if (!locale || locale.startsWith('--')) {
        throw new Error('Missing value for --locale');
      }
      parsed.locale = locale;
      index += 1;
    } else if (arg === '--enable-hooks') {
      parsed.enableHooks = true;
    } else if (arg === '--no-hooks') {
      parsed.noHooks = true;
    } else if (arg === '--dry-run') {
      parsed.dryRun = true;
    } else if (arg === '--json') {
      parsed.json = true;
    } else if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown argument: ${arg}`);
    } else {
      parsed.languages.push(arg);
    }
  }

  const dryRunEnv = process.env.ECC_DRY_RUN;
  if (dryRunEnv !== undefined && dryRunEnv !== '0' && dryRunEnv !== '1') {
    throw new Error('ECC_DRY_RUN must be "1" or "0" when set');
  }
  parsed.dryRun = parsed.dryRun || dryRunEnv === '1';
  parsed.profileIds = dedupeStrings(profileIds);
  parsed.profileId = parsed.profileIds[0] || null;

  return parsed;
}

function normalizeInstallRequest(options = {}) {
  const config = options.config && typeof options.config === 'object'
    ? options.config
    : null;
  const rawProfileIds = [
    ...(Array.isArray(options.profileIds) ? options.profileIds : (options.profileIds ? String(options.profileIds).split(',') : [])),
    ...(options.profileId ? String(options.profileId).split(',') : []),
    ...(Array.isArray(config?.profileIds) ? config.profileIds : (config?.profileIds ? String(config.profileIds).split(',') : [])),
    ...(config?.profileId ? String(config.profileId).split(',') : []),
  ];
  const profileIds = dedupeStrings(rawProfileIds);
  const profileId = profileIds[0] || null;
  const target = options.target || config?.target || 'claude';
  const supportsLocale = target === 'claude' || target === 'claude-project';
  const moduleIds = validateInstallModuleIds(
    dedupeStrings([...(config?.moduleIds || []), ...(options.moduleIds || [])])
  );
  const locale = options.locale || config?.locale || null;
  const localeComponentId = locale ? LOCALE_ALIAS_TO_COMPONENT_ID[locale] : null;
  if (locale && !localeComponentId) {
    throw new Error(
      `Unsupported locale: "${locale}". Supported locales: ${listSupportedLocales().join(', ')}`
    );
  }
  if (locale && !supportsLocale) {
    throw new Error('--locale can only be used with --target claude or --target claude-project');
  }
  const requestedIncludeComponentIds = dedupeStrings([
    ...(config?.includeComponentIds || []),
    ...(options.includeComponentIds || []),
  ]);
  const includeComponentIds = dedupeStrings([
    ...requestedIncludeComponentIds,
    ...(localeComponentId ? [localeComponentId] : []),
  ]);
  const excludeComponentIds = dedupeStrings([
    ...(config?.excludeComponentIds || []),
    ...(options.excludeComponentIds || []),
  ]);
  const legacyLanguages = dedupeStrings(dedupeStrings([
    ...(Array.isArray(options.legacyLanguages) ? options.legacyLanguages : []),
    ...(Array.isArray(options.languages) ? options.languages : []),
  ]).map(language => language.toLowerCase()));
  const hookConsent = resolveHookConsentFlags(options);
  if (hookConsent === 'declined' && moduleIds.includes('hooks-runtime')) {
    throw new Error('--no-hooks cannot be combined with an explicit hooks-runtime module selection');
  }
  const hasManifestBaseSelection = profileIds.length > 0 || moduleIds.length > 0 || includeComponentIds.length > 0;
  const hasNonLocaleManifestSelection = profileIds.length > 0
    || moduleIds.length > 0
    // Install-state persists --locale as a component; auto-update replays it via --with.
    || requestedIncludeComponentIds.some(id => !supportsLocale || !LOCALE_COMPONENT_IDS.has(id))
    || excludeComponentIds.length > 0;
  const usingManifestMode = hasManifestBaseSelection || excludeComponentIds.length > 0;

  if (hasNonLocaleManifestSelection && legacyLanguages.length > 0) {
    throw new Error(
      'Legacy language arguments cannot be combined with --profile, --modules, --with, --without, or manifest config selections'
    );
  }

  if (!options.help && !hasManifestBaseSelection && legacyLanguages.length === 0) {
    throw new Error('No install profile, module IDs, included components, or legacy languages were provided');
  }

  return {
    mode: legacyLanguages.length > 0
      ? 'legacy-compat'
      : (usingManifestMode ? 'manifest' : 'legacy-compat'),
    target,
    profileId,
    profileIds,
    moduleIds,
    includeComponentIds,
    excludeComponentIds,
    legacyLanguages,
    hookConsent,
    configPath: config?.path || options.configPath || null,
  };
}

module.exports = {
  LEGACY_INSTALL_TARGETS,
  normalizeInstallRequest,
  parseInstallArgs,
};
