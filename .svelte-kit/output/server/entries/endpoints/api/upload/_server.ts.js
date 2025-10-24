import { s as supabaseAdmin } from "../../../../chunks/server.js";
import { json } from "@sveltejs/kit";
const POST = async ({ request }) => {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const album = form.get("album_id");
    const caption = form.get("caption");
    if (!file || !album) {
      return new Response("Missing file or album_id", { status: 400 });
    }
    const ext = file.type.split("/")[1] || "jpg";
    const path = `albums/${album}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabaseAdmin.storage.from("memories").upload(path, file, { contentType: file.type });
    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(uploadError.message, { status: 500 });
    }
    const { error: insertError } = await supabaseAdmin.from("memories").insert({
      album_id: album,
      media_url: path,
      caption
    });
    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(insertError.message, { status: 500 });
    }
    return json({ path });
  } catch (error) {
    console.error("API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
};
export {
  POST
};
