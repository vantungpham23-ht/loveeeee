import { Z as head } from "../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import { s as supabase } from "../../chunks/client.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    dayjs.extend(relativeTime);
    let coupleInfo = {};
    let memories = [];
    let loading = true;
    let coupleStatus = null;
    async function loadMemoriesFromSupabase() {
      try {
        loading = true;
        console.log("Loading from Supabase...");
        if (!coupleStatus?.isActive || !coupleStatus?.couple?.id) {
          console.log("No active couple, skipping memory load");
          memories = [];
          return;
        }
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
				`).eq("couple_id", coupleStatus.couple.id).order("created_at", { ascending: false });
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
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 flex items-center justify-center"><div class="text-center"><div class="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-500 mx-auto mb-6"></div> <h2 class="text-2xl font-bold text-gray-700 mb-2">Đang kiểm tra đăng nhập...</h2> <p class="text-gray-600">Vui lòng chờ trong giây lát</p></div></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
