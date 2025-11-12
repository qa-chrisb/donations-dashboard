import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https:/qachris.dev/donations-dashboard/",
  base: "/",
  integrations: [
    tailwind({
      applyBaseStyles: true,
    }),
    preact(),
  ],
});
