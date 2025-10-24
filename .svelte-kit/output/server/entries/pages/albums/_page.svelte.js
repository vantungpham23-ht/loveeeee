import { Z as head } from "../../../chunks/index2.js";
import "../../../chunks/client.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    head($$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Albums - Love Timeline</title>`);
      });
    });
    $$renderer2.push(`<div class="container mx-auto px-4 py-8"><div class="flex justify-between items-center mb-8"><h1 class="text-3xl font-bold text-pink-600">📚 Albums</h1> <button class="btn-primary">Create Album</button></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex justify-center items-center py-12"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div> <span class="ml-3 text-gray-600">Loading albums...</span></div>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
