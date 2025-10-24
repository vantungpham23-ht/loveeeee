import { V as store_get, Z as head, Y as unsubscribe_stores } from "../../../../chunks/index2.js";
import { p as page } from "../../../../chunks/stores.js";
import "../../../../chunks/client.js";
import dayjs from "dayjs";
import { e as escape_html } from "../../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let groupedMemories;
    let memories = [];
    store_get($$store_subs ??= {}, "$page", page).params.id;
    groupedMemories = memories.reduce(
      (groups, memory) => {
        const date = dayjs(memory.created_at);
        const key = date.format("YYYY-MM");
        if (!groups[key]) {
          groups[key] = [];
        }
        groups[key].push(memory);
        return groups;
      },
      {}
    );
    Object.entries(groupedMemories).sort(([a], [b]) => b.localeCompare(a));
    head($$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html("Album")} - Love Timeline</title>`);
      });
    });
    $$renderer2.push(`<div class="container mx-auto px-4 py-8">`);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="flex justify-center items-center py-12"><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
