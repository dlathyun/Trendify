/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "jest-expo",
  testEnvironment: "node",
  roots: ["."],
  // the following line is needed in order to grab modules from the
  // src folder without the need to write them relatively
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "^firebase-admin/app$":
      "./node_modules/firebase-admin/lib/app/index.js",
    "^firebase-admin/auth$":
      "./node_modules/firebase-admin/lib/auth/index.js",
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
  ],
};