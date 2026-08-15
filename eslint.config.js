const expo = require('eslint-config-expo/flat');

module.exports = [
  ...expo,
  { rules: { 'react-hooks/refs': 'off', 'react-hooks/immutability': 'off', 'react-hooks/exhaustive-deps': 'off' } },
];
