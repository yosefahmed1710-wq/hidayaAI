// 👇 TYPES (keep if you use them)
export interface Attachment {
  mimeType: string;
  data: string;
}

// 🔁 Retry helper (kept from your original)
async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (
      retries > 0 &&
      (error.message?.includes("500") ||
        error.message?.includes("fetch failed"))
    ) {
      console.warn(`Retrying... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

// 🧠 MAIN FUNCTION (FIXED — now uses backend)
export async function getIslamicAnswer(
  prompt: string
) {
  return withRetry(async () => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: prompt }),
    });

    if (!res.ok) {
      throw new Error("Failed to get response from server");
    }

    const data = await res.json();
    return data;
  });
}

// 🌅 DAILY INSPIRATION (optional — now also backend)
export async function getDailyInspiration() {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message:
          "Give a short inspiring Quran verse or Hadith with translation",
      }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Daily inspiration error:", error);
    return null;
  }
}

// 📍 NEARBY PLACES (optional — simplified)
export async function findNearbyIslamicPlaces(
  query: string
) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Find ${query} nearby and suggest places`,
      }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Nearby places error:", error);
    throw error;
  }
}
