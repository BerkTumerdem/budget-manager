module.exports = {
  JWT: {
    EXPIRATION: "7d",
    REFRESH_EXPIRATION: "30d",
  },
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
  VALIDATION: {
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 50,
    EMAIL_MAX_LENGTH: 100,
  },
  CURRENCY: {
    DEFAULT: "USD",
    SUPPORTED: ["USD", "EUR", "RON", "GBP"],
  },
  THEME: {
    DEFAULT: "light",
    SUPPORTED: ["light", "dark"],
  },
  LANGUAGE: {
    DEFAULT: "en",
    SUPPORTED: ["en", "ro"],
  },
}; 