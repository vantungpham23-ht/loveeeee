import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.B-exiDdg.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BpldQMAd.js","_app/immutable/chunks/Cslclzbr.js","_app/immutable/chunks/Bf55KTM_.js","_app/immutable/chunks/DEvKvmVM.js","_app/immutable/chunks/B9n_ukdH.js","_app/immutable/chunks/Dz2IP27x.js","_app/immutable/chunks/DOdOfJzB.js","_app/immutable/chunks/Bgar94nq.js","_app/immutable/chunks/BBvWJmYc.js"];
export const stylesheets = ["_app/immutable/assets/0.D1YJ66GY.css"];
export const fonts = [];
