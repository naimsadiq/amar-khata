// Reusable Login Function
export const signIn = async (email, pin) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, pin }),
      },
    );

    const result = await response.json();

    // ✅ Success
    if (response.ok) {
      return {
        success: true,
        data: result,
      };
    }

    // ❌ Backend Error
    return {
      success: false,
      message: result.message || "Invalid email or pin",
    };
  } catch (error) {
    console.error("Network error:", error);

    // ❌ Network Error
    return {
      success: false,
      message: "Unable to connect to the server!",
    };
  }
};
