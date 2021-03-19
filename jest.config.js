module.exports = {
  testRegex: 'test.(js|ts)$',
  coverageDirectory: './coverage/',
  collectCoverage: true,
  coverageReporters: ['json', 'html', 'text', 'text-summary', 'lcov'],
  collectCoverageFrom: ['src/**/*.{js,ts}', 'tests/**/*.{js,ts}'],
};
