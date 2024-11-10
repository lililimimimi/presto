import { handleApiError } from "./errorHandler";

export const login = async (email, password) => {
  const url = "http://localhost:5005/admin/auth/login";

  const userData = { email, password };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
     const error = new Error("Login failed");
     error.response = response;
     throw error;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during login:", error);
    const errorMessage = handleApiError(error, "login");
    throw new Error(errorMessage);
  }
};

export const register = async (email, password, name) => {
  const url = "http://localhost:5005/admin/auth/register";

  const userData = { email, password, name };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = new Error("Registration failed");
      error.response = response;
      throw error;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during registration:", error);
    const errorMessage = handleApiError(error, "register");
    throw new Error(errorMessage);
  }
};
