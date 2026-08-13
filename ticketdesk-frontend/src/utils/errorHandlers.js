import axios from 'axios';

export const getErrorMessage = (error, defaultMsg = 'An error occurred') => {
  if (!error) return defaultMsg;

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Network error: Please check your internet connection or backend server status.';
    }

    const { status, data } = error.response;

    if (data && typeof data === 'object' && data.message) {
      return String(data.message);
    }

    switch (status) {
      case 400:
        return 'Bad request. Please check your input parameters.';
      case 401:
        return 'Session expired or unauthorized. Please log in again.';
      case 403:
        return 'Access denied. You do not have permission for this operation.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'Conflict detected. Resource already exists.';
      case 422:
        return 'Validation error. Please verify your form input.';
      case 500:
        return 'Internal server error. Please try again later.';
      default:
        return defaultMsg;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMsg;
};
