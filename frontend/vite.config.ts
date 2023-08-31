import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === "serve") {
    return {
      server: {
        headers: {
          "Content-Security-Policy":
            "default-src 'none'; script-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:1337; img-src 'self'; style-src 'self' 'unsafe-inline'; manifest-src 'self'",
        },
      },
      plugins: [react(), viteTsconfigPaths()],
    };
  } else {
    return {
      server: {
        headers: {
          "Content-Security-Policy":
            "default-src 'none'; script-src 'self'; connect-src 'self' harychat.azurewebsites.net; img-src 'self' ; style-src 'self'; manifest-src 'self'",
        },
      },
      plugins: [react(), viteTsconfigPaths()],
    };
  }
});
