import { $ as bind_props, Z as head, a0 as attr, a1 as ensure_array_like, W as attr_class, X as stringify } from "../../chunks/index2.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import { c as ssr_context, e as escape_html } from "../../chunks/context.js";
import { s as supabase } from "../../chunks/client.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function LoveTimer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let startDate = $$props["startDate"];
    let daysCount = 0;
    let hoursCount = 0;
    let minutesCount = 0;
    let secondsCount = 0;
    onDestroy(() => {
    });
    $$renderer2.push(`<div class="relative bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50 overflow-hidden"><div class="text-center mb-4"><h3 class="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">⏰ Thời Gian Yêu Nhau</h3> <p class="text-gray-600 font-medium">Từ ngày bắt đầu đến hiện tại</p></div> <div class="flex items-center justify-center space-x-3 mb-4"><div class="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 min-w-[80px] shadow-lg border border-rose-100/50"><span class="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent block transition-all duration-300">${escape_html(daysCount.toString().padStart(3, "0"))}</span> <span class="text-xs font-semibold text-gray-600 mt-1">Ngày</span></div> <div class="text-lg font-bold text-rose-400 animate-pulse mx-1">:</div> <div class="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 min-w-[70px] shadow-lg border border-rose-100/50"><span class="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent block transition-all duration-300">${escape_html(hoursCount.toString().padStart(2, "0"))}</span> <span class="text-xs font-semibold text-gray-600 mt-1">Giờ</span></div> <div class="text-lg font-bold text-rose-400 animate-pulse mx-1">:</div> <div class="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 min-w-[70px] shadow-lg border border-rose-100/50"><span class="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent block transition-all duration-300">${escape_html(minutesCount.toString().padStart(2, "0"))}</span> <span class="text-xs font-semibold text-gray-600 mt-1">Phút</span></div> <div class="text-lg font-bold text-rose-400 animate-pulse mx-1">:</div> <div class="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 min-w-[70px] shadow-lg border border-rose-100/50"><span class="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent block transition-all duration-300">${escape_html(secondsCount.toString().padStart(2, "0"))}</span> <span class="text-xs font-semibold text-gray-600 mt-1">Giây</span></div></div> <div class="absolute inset-0 pointer-events-none"><div class="absolute top-4 left-4 text-lg opacity-15 animate-bounce" style="animation-duration: 2s; animation-delay: 0s;">💖</div> <div class="absolute top-4 right-4 text-lg opacity-15 animate-bounce" style="animation-duration: 2.5s; animation-delay: 0.5s;">💕</div> <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-lg opacity-15 animate-bounce" style="animation-duration: 3s; animation-delay: 1s;">💗</div> <div class="absolute top-1/2 left-2 text-lg opacity-15 animate-pulse" style="animation-duration: 2.2s; animation-delay: 1.5s;">💝</div> <div class="absolute top-1/2 right-2 text-lg opacity-15 animate-pulse" style="animation-duration: 2.8s; animation-delay: 0.8s;">💘</div></div></div>`);
    bind_props($$props, { startDate });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    dayjs.extend(relativeTime);
    let coupleInfo = {};
    let memories = [];
    let loading = true;
    async function loadMemoriesFromSupabase() {
      try {
        loading = true;
        console.log("Loading from Supabase...");
        const { data: memoriesData, error: memoriesError } = await supabase.from("memories").select(`
					id,
					media_url,
					caption,
					created_at,
					albums (
						id,
						title,
						description
					)
				`).order("created_at", { ascending: false });
        console.log("Supabase memories response:", { memoriesData, memoriesError });
        if (memoriesError) {
          console.error("Error loading memories:", memoriesError);
          loadFromLocalStorage();
          return;
        }
        memories = [];
        console.log("Memories from Supabase:", memoriesData);
        if (memoriesData && memoriesData.length > 0) {
          memories = memoriesData.map((memory) => ({
            id: memory.id,
            media_url: memory.media_url,
            caption: memory.caption || "",
            created_at: memory.created_at,
            albums: {
              title: memory.albums?.title || "Unknown Album",
              description: memory.albums?.description || ""
            }
          }));
        }
        console.log("Memories after processing:", memories);
      } catch (error) {
        console.error("Error loading memories:", error);
        loadFromLocalStorage();
      } finally {
        loading = false;
      }
    }
    function loadFromLocalStorage() {
      const savedAlbums = localStorage.getItem("uploadedAlbums");
      if (savedAlbums) {
        const albums = JSON.parse(savedAlbums);
        const validAlbums = albums.filter((album) => {
          if (!album.media_url) return true;
          return album.media_url.startsWith("data:") || album.media_url.startsWith("http");
        });
        memories = validAlbums.map((album, index) => ({
          id: album.id || index,
          media_url: album.media_url || null,
          caption: album.caption || "",
          created_at: album.created_at || (/* @__PURE__ */ new Date()).toISOString(),
          albums: { title: album.albums?.title || "New Album" }
        }));
        if (validAlbums.length !== albums.length) {
          localStorage.setItem("uploadedAlbums", JSON.stringify(validAlbums));
        }
      } else {
        memories = [
          {
            id: 1,
            media_url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400",
            caption: "Our first date",
            created_at: "2024-01-15",
            albums: { title: "First Date" }
          },
          {
            id: 2,
            media_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
            caption: "Valentine's Day",
            created_at: "2024-02-14",
            albums: { title: "Valentine's" }
          },
          {
            id: 3,
            media_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
            caption: "Summer vacation",
            created_at: "2024-07-20",
            albums: { title: "Summer Trip" }
          }
        ];
      }
    }
    async function refreshTimeline() {
      await loadMemoriesFromSupabase();
    }
    if (typeof window !== "undefined") {
      window.refreshTimeline = refreshTimeline;
    }
    coupleInfo.startDate ? dayjs().diff(dayjs(coupleInfo.startDate), "day") : 0;
    coupleInfo.startDate ? dayjs(coupleInfo.startDate).fromNow() : "";
    head($$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Dòng Thời Gian Tình Yêu - Trang Chủ</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Lưu giữ những khoảnh khắc đẹp nhất của tình yêu"/>`);
    });
    $$renderer2.push(`<div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 pb-24 relative overflow-hidden"><div class="absolute inset-0 overflow-hidden pointer-events-none"><div class="absolute top-16 left-8 text-5xl opacity-10 animate-pulse">💖</div> <div class="absolute top-32 right-12 text-4xl opacity-15 animate-bounce">💕</div> <div class="absolute bottom-20 left-16 text-6xl opacity-8 animate-pulse">💝</div> <div class="absolute bottom-32 right-8 text-3xl opacity-12 animate-bounce">💗</div> <div class="absolute top-1/2 left-4 text-4xl opacity-10 animate-pulse">🌸</div> <div class="absolute top-1/3 right-6 text-3xl opacity-15 animate-bounce">🌺</div></div> <div class="relative z-10"><div class="relative container mx-auto px-4 py-16">`);
    if (coupleInfo.partner1 && coupleInfo.partner2) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center mb-12"><div class="flex justify-center items-center mb-8 relative"><div class="relative group">`);
      if (coupleInfo.avatar1) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<img${attr("src", coupleInfo.avatar1)}${attr("alt", coupleInfo.partner1)} class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-2xl group-hover:scale-110 transition-transform duration-300"/>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="w-20 h-20 rounded-full bg-gradient-to-br from-rose-200 to-pink-300 flex items-center justify-center text-3xl border-4 border-white shadow-2xl group-hover:scale-110 transition-transform duration-300">👤</div>`);
      }
      $$renderer2.push(`<!--]--> <div class="absolute -inset-2 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-sm"></div></div> <div class="mx-6 text-5xl animate-pulse hover:animate-bounce cursor-pointer">💕</div> <div class="relative group">`);
      if (coupleInfo.avatar2) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<img${attr("src", coupleInfo.avatar2)}${attr("alt", coupleInfo.partner2)} class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-2xl group-hover:scale-110 transition-transform duration-300"/>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="w-20 h-20 rounded-full bg-gradient-to-br from-purple-200 to-fuchsia-300 flex items-center justify-center text-3xl border-4 border-white shadow-2xl group-hover:scale-110 transition-transform duration-300">👤</div>`);
      }
      $$renderer2.push(`<!--]--> <div class="absolute -inset-2 bg-gradient-to-r from-purple-400 to-fuchsia-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-sm"></div></div></div> <h1 class="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent mb-4 tracking-wide">${escape_html(coupleInfo.partner1)} &amp; ${escape_html(coupleInfo.partner2)}</h1> `);
      if (coupleInfo.startDate) {
        $$renderer2.push("<!--[-->");
        LoveTimer($$renderer2, { startDate: coupleInfo.startDate });
      } else {
        $$renderer2.push("<!--[!-->");
        LoveTimer($$renderer2, { startDate: "2024-01-01" });
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="text-center mb-12"><div class="text-8xl mb-6 animate-pulse">💖</div> <h1 class="text-5xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent mb-4 tracking-wide">Dòng Thời Gian Tình Yêu</h1> <p class="text-gray-700 text-xl mb-8 font-medium">Lưu giữ những khoảnh khắc đẹp nhất của tình yêu</p> <div class="mb-8">`);
      LoveTimer($$renderer2, { startDate: "2024-01-01" });
      $$renderer2.push(`<!----></div> <a href="/settings" class="inline-block bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-4 rounded-3xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">Thiết Lập Hồ Sơ 💕</a></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="container mx-auto px-4 mb-8 -mt-8"><div class="bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 relative overflow-hidden"><div class="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-pink-50/50"></div> <div class="relative z-10 text-center mb-6"><h2 class="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent mb-3 flex items-center justify-center"><span class="mr-3 text-4xl animate-pulse">💕</span> Dòng Thời Gian Tình Yêu <span class="ml-3 text-4xl animate-pulse">💕</span></h2> <p class="text-gray-600 text-lg font-medium">Những khoảnh khắc đáng nhớ của chúng ta</p></div> `);
    if (loading) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center py-16 relative z-10"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div> <h3 class="text-xl font-bold text-gray-700 mb-2">Đang tải kỷ niệm...</h3> <p class="text-gray-600">Vui lòng chờ trong giây lát</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (memories.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="relative z-10"><div class="absolute left-10 top-0 bottom-0 w-2 bg-gradient-to-b from-rose-300 via-pink-400 to-fuchsia-300 rounded-full shadow-lg"></div> <div class="space-y-10"><!--[-->`);
        const each_array = ensure_array_like(memories.slice(0, 8));
        for (let index = 0, $$length = each_array.length; index < $$length; index++) {
          let memory = each_array[index];
          $$renderer2.push(`<div${attr_class(`relative flex items-start ${stringify(index % 2 === 0 ? "flex-row" : "flex-row-reverse")} group`)}><div class="relative z-20 flex-shrink-0 w-20 h-20 bg-gradient-to-br from-white to-rose-50 rounded-full border-4 border-rose-300 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300">`);
          if (memory.media_url) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<img${attr("src", memory.media_url)} alt="Kỷ niệm" class="w-14 h-14 object-cover rounded-full"/> <span class="text-2xl hidden">📚</span>`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<span class="text-2xl">📚</span>`);
          }
          $$renderer2.push(`<!--]--> <div class="absolute -inset-2 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-sm"></div></div> <div${attr_class(`flex-1 mx-8 ${stringify(index % 2 === 0 ? "ml-0" : "mr-0")} group`)}><div class="bg-gradient-to-br from-rose-50/80 to-pink-50/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-rose-100/50 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 relative overflow-hidden"><div class="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div> <div class="relative z-10"><div class="text-center"><h3 class="font-bold text-gray-800 text-lg mb-2">${escape_html(memory.albums?.title || "Kỷ niệm")}</h3> <span class="text-sm text-gray-500 bg-white/60 px-3 py-1 rounded-full font-medium block">${escape_html(dayjs(memory.created_at).format("DD/MM/YYYY"))}</span></div> `);
          if (memory.caption) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<p class="text-gray-700 text-base leading-relaxed font-medium mt-3 text-center">${escape_html(memory.caption)}</p>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div></div></div></div>`);
        }
        $$renderer2.push(`<!--]--></div> `);
        if (memories.length > 8) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="text-center mt-10"><a href="/albums" class="inline-block bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">Xem Tất Cả Kỷ Niệm 💕</a></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="text-center py-16 relative z-10"><div class="text-8xl mb-6 animate-bounce">📸</div> <h3 class="text-2xl font-bold text-gray-700 mb-4">Chưa có kỷ niệm nào</h3> <p class="text-gray-600 mb-8 text-lg font-medium">Hãy bắt đầu tạo ra những kỷ niệm đẹp cùng nhau!</p> <div class="flex justify-center space-x-4"><a href="/upload" class="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">Tải Lên Kỷ Niệm 📸</a> <a href="/albums" class="px-6 py-3 bg-white border-2 border-rose-300 text-rose-600 rounded-xl hover:bg-rose-50 transition-all duration-300 font-medium text-base shadow-lg hover:shadow-xl transform hover:scale-105">Tạo Album Mới 📚</a></div></div>`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
  });
}
export {
  _page as default
};
