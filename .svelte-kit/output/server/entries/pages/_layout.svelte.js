import { V as store_get, W as attr_class, X as stringify, Y as unsubscribe_stores, Z as head, _ as slot } from "../../chunks/index2.js";
import { p as page } from "../../chunks/stores.js";
function NavbarTabs($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let currentPath;
    currentPath = store_get($$store_subs ??= {}, "$page", page).url.pathname;
    $$renderer2.push(`<nav class="fixed bottom-0 inset-x-0 bg-gradient-to-t from-white/98 to-white/95 backdrop-blur-xl border-t border-rose-200/50 flex justify-around py-2 z-50 shadow-lg"><a href="/" data-sveltekit-preload-data="off"${attr_class(`flex flex-col items-center text-xs py-2 px-3 rounded-2xl transition-all duration-300 group ${stringify(currentPath === "/" ? "text-rose-600 bg-gradient-to-br from-rose-100 to-pink-100 scale-105 shadow-md" : "text-gray-600 hover:text-rose-500 hover:scale-105 hover:bg-rose-50/50")}`)}><span class="text-lg mb-1 group-hover:animate-bounce">🏠</span> <span class="font-medium">Trang Chủ</span></a> <a href="/albums" data-sveltekit-preload-data="off"${attr_class(`flex flex-col items-center text-xs py-2 px-3 rounded-2xl transition-all duration-300 group ${stringify(currentPath.startsWith("/albums") ? "text-rose-600 bg-gradient-to-br from-rose-100 to-pink-100 scale-105 shadow-md" : "text-gray-600 hover:text-rose-500 hover:scale-105 hover:bg-rose-50/50")}`)}><span class="text-lg mb-1 group-hover:animate-bounce">📚</span> <span class="font-medium">Album</span></a> <a href="/upload" data-sveltekit-preload-data="off"${attr_class(`flex flex-col items-center text-xs py-2 px-3 rounded-2xl transition-all duration-300 group ${stringify(currentPath === "/upload" ? "text-rose-600 bg-gradient-to-br from-rose-100 to-pink-100 scale-105 shadow-md" : "text-gray-600 hover:text-rose-500 hover:scale-105 hover:bg-rose-50/50")}`)}><span class="text-lg mb-1 group-hover:animate-bounce">📸</span> <span class="font-medium">Tải Lên</span></a> <a href="/settings" data-sveltekit-preload-data="off"${attr_class(`flex flex-col items-center text-xs py-2 px-3 rounded-2xl transition-all duration-300 group ${stringify(currentPath === "/settings" ? "text-rose-600 bg-gradient-to-br from-rose-100 to-pink-100 scale-105 shadow-md" : "text-gray-600 hover:text-rose-500 hover:scale-105 hover:bg-rose-50/50")}`)}><span class="text-lg mb-1 group-hover:animate-bounce">⚙️</span> <span class="font-medium">Cài Đặt</span></a></nav>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _layout($$renderer, $$props) {
  head($$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Love Timeline</title>`);
    });
    $$renderer2.push(`<meta name="description" content="Share your love memories"/> <meta name="viewport" content="width=device-width, initial-scale=1"/>`);
  });
  $$renderer.push(`<main class="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50"><!--[-->`);
  slot($$renderer, $$props, "default", {});
  $$renderer.push(`<!--]--></main> `);
  NavbarTabs($$renderer);
  $$renderer.push(`<!---->`);
}
export {
  _layout as default
};
