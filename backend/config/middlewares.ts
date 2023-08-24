export default [
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  {
    name: "strapi::body",
    config: {
      parsedMethods: ["GET", "POST", "PUT", "PATCH"],
    },
  },
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
