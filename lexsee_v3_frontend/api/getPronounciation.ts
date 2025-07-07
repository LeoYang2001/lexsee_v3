export const getPronunciationAudio = async (
  word: string
): Promise<string | null> => {
  const apiUrl =
    "https://converttexttospeech-lcwrfk4hzq-uc.a.run.app/convert-text-to-speech";

  const requestData = {
    text: word,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (response.ok) {
      const data = await response.json();
      return data.audioUrl;
    } else {
      console.error(
        "Failed to fetch audio URL:",
        response.status,
        response.statusText
      );
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
