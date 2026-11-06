import { Plugin } from "@opencode/plugin";
/**
 * The server half of the plugin.
 *
 * The desktop app loads a plugin's GUI only when the plugin's server part
 * loaded, so a GUI-only package never reaches the window. This part does
 * nothing on purpose: it exists so the package is a complete plugin and the
 * desktop will load its GUI.
 */
export default Plugin.define({
    id: "opencode-glass",
    async setup() {
        // Nothing to do on the server.
    },
});
