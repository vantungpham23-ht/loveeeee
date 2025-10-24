import { Z as head } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import "../../../chunks/client.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    head($$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Couple Setup - Love Timeline</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Create or join a couple to start sharing memories"/>`);
    });
    $$renderer2.push(`<div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 flex items-center justify-center px-4"><div class="max-w-md w-full">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center"><div class="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-500 mx-auto mb-6"></div> <h2 class="text-2xl font-bold text-gray-700 mb-2">Checking couple status...</h2> <p class="text-gray-600">Please wait while we check your couple information</p></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _page as default
};
