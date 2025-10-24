import { Z as head, $ as attr } from "../../../chunks/index2.js";
import "../../../chunks/client.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { e as escape_html } from "../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let email = "";
    let password = "";
    let loading = false;
    head($$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Login - Love Timeline</title>`);
      });
    });
    $$renderer2.push(`<div class="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4"><div class="max-w-md w-full"><div class="text-center mb-8"><div class="text-6xl mb-4">💖</div> <h1 class="text-3xl font-bold text-pink-600 mb-2">Love Timeline</h1> <p class="text-gray-600">Sign in to your account</p></div> <div class="bg-white rounded-3xl shadow-lg p-8"><form class="space-y-6"><div><label class="block text-sm font-medium text-gray-700 mb-2">Email</label> <input${attr("value", email)} type="email" placeholder="Enter your email" required class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-colors duration-200"/></div> <div><label class="block text-sm font-medium text-gray-700 mb-2">Password</label> <input${attr("value", password)} type="password" placeholder="Enter your password" required class="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-100 transition-colors duration-200"/></div> <button type="submit"${attr("disabled", loading, true)} class="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50">${escape_html("Sign In")}</button></form> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="text-center mt-6 text-sm text-gray-500"><p>Don't have an account? Create one in Supabase Dashboard</p></div></div></div>`);
  });
}
export {
  _page as default
};
