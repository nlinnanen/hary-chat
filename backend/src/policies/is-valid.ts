const jwt = require("jsonwebtoken");

module.exports = async (policyContext, config, { strapi }) => {
  const token = policyContext.request.header?.["X-Conversation-Token"]
  const uuid = policyContext.request.header?.["X-Conversation-Uuid"]
  const decoded = await jwt.decode(token,  process.env.JWT_SECRET);
  return decoded?.id && uuid && decoded?.id === uuid;
};
