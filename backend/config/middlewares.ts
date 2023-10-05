export default [
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      origin: [
        process.env.FRONTEND_URL,
        process.env.DOMAIN
      ], // Replace with your frontend domain(s)
      headers: ["Content-Type", "Authorization", "X-Frame-Options", "X-Conversation-Token", "X-Conversation-Uuid"],
      expose: ["WWW-Authenticate", "Server-Authorization"],
      credentials: true,
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
