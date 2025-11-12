import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "static",
  site: "https://qa-chris.github.io/donations-dashboard/",
  base: "/",
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    preact(),
  ],
});
