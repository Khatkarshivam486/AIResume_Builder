import authService from "./authService";

const API_BASE = "http://localhost:5000/api";

export const enhanceTextWithGemini = async (section, data) => {
  try {
    const response = await authService.authenticatedRequest(
      `${API_BASE}/enhance`,
      {
        method: "POST",
        body: JSON.stringify({
          section,
          data,
        }),
      }
    );

    const result = await response.json();
    return result.enhanced;
  } catch (error) {
    console.error("❌ Enhance API error:", error);
    return null;
  }
};
