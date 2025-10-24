import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.Br5PXaDg.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/C2Irgtfr.js","_app/immutable/chunks/DiGzQK4H.js","_app/immutable/chunks/ByrdjzpP.js","_app/immutable/chunks/wpr6unQR.js","_app/immutable/chunks/BuS2aiC-.js","_app/immutable/chunks/BgUJJVl0.js","_app/immutable/chunks/BeWLKC0S.js","_app/immutable/chunks/BAi05rh5.js","_app/immutable/chunks/iwpuV49D.js"];
export const stylesheets = ["_app/immutable/assets/0.Cyo9aAdP.css"];
export const fonts = [];
