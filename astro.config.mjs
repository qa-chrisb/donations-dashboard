import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  site: "https://qa-chris.github.io/donations-dashboard/",
  base: "/donations-dashboard/",
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    preact(),
  ],
});
