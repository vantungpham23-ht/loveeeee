import { Z as head } from "../../../chunks/index2.js";
import "../../../chunks/client.js";
import { e as escape_html } from "../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let status = "Testing...";
    head($$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Supabase Test</title>`);
      });
    });
    $$renderer2.push(`<div class="container mx-auto px-4 py-8"><h1 class="text-2xl font-bold text-pink-600 mb-4">Supabase Connection Test</h1> <div class="card"><p><strong>Status:</strong> ${escape_html(status)}</p> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="mt-4"><a href="/" class="btn-primary">Back to Home</a></div></div>`);
  });
}
export {
  _page as default
};
