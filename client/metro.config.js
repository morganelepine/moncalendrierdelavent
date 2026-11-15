// To ensure unique Debug IDs get assigned to the generated bundles and source maps,
// add Sentry Serializer to the Metro configuration:

const { getSentryExpoConfig } = require("@sentry/react-native/metro");

// Session Replay isn't used: dropping its packages saves ~150 KB of bundle.
const config = getSentryExpoConfig(__dirname, { includeWebReplay: false });

module.exports = config;
