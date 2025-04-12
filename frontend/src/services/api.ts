
import axios from 'axios';
import { ApiResponse } from '../types';

// Base URL for API
const API_URL = 'http://127.0.0.1:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Function to predict cell class from image
export const predictCellImage = async (imageFile: File): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await apiClient.post<ApiResponse>('/predict', formData);
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error); // Log the error for debugging
    if (axios.isAxiosError(error) && error.response) {
      console.error('API Error:', error.response.data); // Log the error response for debugging
      // Handle specific error response structure if needed 
      return error.response.data as ApiResponse;
    }
    return {

      success: false,
      error: 'Failed to connect to server',
    };
  }
};

export default {
  predictCellImage,
};
