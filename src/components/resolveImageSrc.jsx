import API_ENDPOINTS from "../config/api";

export const resolveImageSrc = (img) => {
  if (!img) return "";

  if (typeof img === "string") return API_ENDPOINTS.VEHICLES?.IMAGE ? API_ENDPOINTS.VEHICLES.IMAGE(img) : img;

  if (typeof img === "object") {
    if (img.url) return img.url;
    if (img.filename && API_ENDPOINTS.VEHICLES?.IMAGE) return API_ENDPOINTS.VEHICLES.IMAGE(img.filename);
  }

  return "";
};

export default resolveImageSrc;
