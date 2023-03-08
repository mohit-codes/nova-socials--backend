const { ALLOWED_DOMAINS } = require("./constants");

const checkIfDomainIsAllowed = (domain) => {
  return ALLOWED_DOMAINS.some((origin) => domain.includes(origin));
};

const corsOptions = {
  origin: (origin, callback) => {
    if (checkIfDomainIsAllowed(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

module.exports = corsOptions;
