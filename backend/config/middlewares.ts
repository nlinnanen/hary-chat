export default [
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      origin: [process.env.FRONTEND_URL, process.env.DOMAIN], // Replace with your frontend domain(s)
      headers: [
        "Content-Type",
        "Authorization",
        "X-Frame-Options",
        "X-Conversation-Token",
        "X-Conversation-Uuid",
      ],
      expose: ["WWW-Authenticate", "Server-Authorization"],
      credentials: true,
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  {
    name: "strapi::session",
    config: {
      secret: process.env.JWT_SECRET,
      maxAge: 86400000,
      clearInvalid: false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : undefined,
      cookie: {
        maxAge: 86400000,
        httpOnly: true,
        sameSite: "none",
      },
    },
  },
  "strapi::favicon",
  "strapi::public",
];
