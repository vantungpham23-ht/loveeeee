import { Z as head, a1 as ensure_array_like, a0 as attr } from "../../../chunks/index2.js";
import "../../../chunks/client.js";
import { e as escape_html } from "../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let albums = [];
    let selectedAlbum = "";
    let caption = "";
    head($$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Upload - Love Timeline</title>`);
      });
    });
    $$renderer2.push(`<div class="container mx-auto px-4 py-8"><div class="text-center mb-8"><h1 class="text-3xl font-bold text-pink-600 mb-2">📸 Upload New Memory</h1> <p class="text-gray-600">Share your special moments with your loved one.</p></div> <div class="max-w-2xl mx-auto bg-white/90 backdrop-blur rounded-3xl shadow-lg p-8"><form class="space-y-6"><div class="border-2 border-dashed border-pink-300 rounded-2xl p-8 text-center cursor-pointer hover:border-pink-400 transition-colors duration-200" role="button" tabindex="0"><input type="file" id="fileInput" class="hidden" accept="image/*,video/*"/> `);
    {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="text-6xl mb-4">⬆️</div> <p class="text-gray-700 font-medium mb-2">Drag &amp; drop your photo/video here</p> <p class="text-gray-500 text-sm">or click to browse</p>`);
    }
    $$renderer2.push(`<!--]--></div> <div><label for="albumSelect" class="block text-sm font-medium text-gray-700 mb-2">Select Album</label> `);
    $$renderer2.select(
      {
        id: "albumSelect",
        value: selectedAlbum,
        class: "w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-colors duration-200 bg-white/80 backdrop-blur",
        required: true
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(albums);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let album = each_array[$$index];
          $$renderer3.option({ value: album.id }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(album.title)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <div><label for="captionInput" class="block text-sm font-medium text-gray-700 mb-2">Caption (Optional)</label> <input id="captionInput"${attr("value", caption)} placeholder="Add a sweet caption..." type="text" class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-colors duration-200 bg-white/80 backdrop-blur"/></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <button type="submit"${attr("disabled", true, true)} class="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">${escape_html("Upload Memory")}</button></form></div></div>`);
  });
}
export {
  _page as default
};
