export const checkFormData = (formData: FormData, requiredFields: string[]) => {
  const userData = Object.fromEntries(formData.entries());

  for (const field of requiredFields) {
    if (!userData[field]) {
      return {
        data: null,
        message: `Отсутствует поле: ${field}`,
        error: true,
      };
    }
  }

  return { error: false, message: null, data: userData };
};
