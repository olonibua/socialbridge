import axios from "axios";

export const postToLinkedIn = async (content: string, accessToken: string) => {
  try {
    const response = await axios.post(
      "https://api.linkedin.com/v2/shares",
      {
        content: {
          contentEntities: [
            {
              entityLocation: content,
            },
          ],
          title: content,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("LinkedIn post failed", error);
    throw error;
  }
};
