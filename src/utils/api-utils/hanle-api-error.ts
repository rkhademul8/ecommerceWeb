import ApiError from "./api-error";

export const handleApiErrors = (error: any) => {
  if (error instanceof ApiError) {
    return error.message;
  }
  return "An unexpected error. Please try again.";
};
