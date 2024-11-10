export const handleApiError = (error, type = "general") => {
  let errorMessage = "Operation failed, please try again";

  if (error.response) {
    const errorMessages = {
      login: {
        400: "Invalid username or password",
        401: "Unauthorized, please login again",
        404: "User does not exist",
      },
      register: {
        400: "Invalid registration information",
        409: "This email is already registered",
      },
      general: {
        400: "Invalid request parameters",
        401: "Unauthorized, please login again",
        403: "Access denied",
        404: "Resource not found",
        500: "Server error, please try again later",
      },
    };

    const messageMap = errorMessages[type] || errorMessages.general;
    errorMessage =
      messageMap[error.response.status] ||
      error.response.data?.message ||
      `${type} failed, please try again`;
  } else if (error.request) {
    errorMessage = "Network error, please check your connection";
  }

  return errorMessage;
};
