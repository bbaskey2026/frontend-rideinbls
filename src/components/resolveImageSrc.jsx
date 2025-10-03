import API_ENDPOINTS from "@/config/api";

export const resolveImageSrc = (img) => {
  if (!img) return "";

  if (typeof img === "string") return API_ENDPOINTS.IMAGES.BY_FILENAME(img);

  if (typeof img === "object") {
    if (img.url) return img.url;
    if (img.fileId) return API_ENDPOINTS.IMAGES.BY_ID(img.fileId);
    if (img.filename) return API_ENDPOINTS.IMAGES.BY_FILENAME(img.filename);
  }

  return "";
};
