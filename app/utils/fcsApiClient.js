const API_KEY = '3IBcNbfUTZQk7y9JgkUnP5dz0HWdOnK3R';

/**
 * fetchWithFCSKey digunakan untuk melakukan fetch ke FCS API
 * @param {(apiKey: string) => string} urlBuilderFn - Fungsi yang menerima API key dan menghasilkan URL
 * @returns {Promise<any>} - JSON hasil response
 */
export const fetchWithFCSKey = async (urlBuilderFn) => {
  const url = urlBuilderFn(API_KEY);
  const res = await fetch(url);
  const json = await res.json();

  if (json?.status === true && json?.response) {
    return json;
  } else {
    throw new Error('Request failed or invalid response');
  }
};
