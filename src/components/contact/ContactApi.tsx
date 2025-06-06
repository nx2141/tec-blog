import axios from "axios";

interface ContactFormData {
  name: string;
  mail: string;
  phone_number?: string;
  budget: string;
  message: string;
}

export const fetchCsrfToken = async () => {
  const response = await axios.get(
    `${import.meta.env.PUBLIC_FORM_CSRF_API_URL}`,
  );
  return response.data.csrf_token;
};

export const submitContactForm = async (
  formData: ContactFormData,
  csrfToken: string,
) => {
  return axios.post(`${import.meta.env.PUBLIC_FORM_API_URL}`, formData, {
    headers: {
      "X-CSRF-TOKEN": csrfToken,
    },
  });
};
