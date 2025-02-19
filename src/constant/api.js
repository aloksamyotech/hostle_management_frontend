import axios from 'axios';
export const postApi = async (url, data, headers = {}) => {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    const response = await axios.post(url, data, { headers: defaultHeaders });
    return response;
  } catch (error) {
    console.error('API Error:', error.response || error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};
export const getApi = async (url, params = {}, headers = {}) => {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    const response = await axios.get(url, {
      headers: defaultHeaders,
      params: params
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('No data available');
    } else {
      console.error('API Error:', error.response || error.message);
      throw new Error(error.response ? error.response.data : error.message);
    }
  }
};
export const updateApi = async (url, data, headers = {}) => {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    const response = await axios.put(url, data, { headers: defaultHeaders });
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response || error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};
export const deleteApi = async (url, params = {}, headers = {}) => {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    const response = await axios.delete(url, { headers: defaultHeaders, params: params });
    return response;
  } catch (error) {
    console.error('API Error:', error.response || error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};
export const updatepaymentApi = async (url, data, headers = {}) => {
  try {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    const response = await axios.put(url, data, { headers: defaultHeaders });
    return response;
  } catch (error) {
    console.error('API Error:', error.response || error.message);
    throw new Error(error.response ? error.response.data : error.message);
  }
};
