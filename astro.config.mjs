import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";

export default defineConfig({
    output: "static",
    site: "https://qa-chris.github.io/donations-dashboard/",
    base: "/",
    integrations: [preact()],
});
