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
      throw new Error(`Login failed with status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
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
      throw new Error(`Registration failed with status: ${response.status}`);
    }

    const data = await response.json();  
    return data;  
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;  
  }
};

