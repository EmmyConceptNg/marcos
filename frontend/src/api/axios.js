import axios from "axios";
import { clearUser } from "../redux/UserReducer";

let baseURL = "";

if (window.location.origin.includes("localhost")) {
  baseURL = "http://localhost:8080";
} else {
  baseURL = "https://marcos-90gs.onrender.com";
}


const instance = axios.create({
  baseURL,
});

// Function to set up interceptors
export const setupAxiosInterceptors = (dispatch, navigate) => {
  instance.interceptors.response.use(
    (response) => response, // Simply return the response if successful
    (error) => {
      if (error.response && error.response.status === 403) {
        // Log out user on 403 Forbidden
        dispatch(clearUser()); // Replace with your actual Redux action
        navigate("/login");
      }
      return Promise.reject(error); // Forward the error
    }
  );
};

// Function to construct full image URLs
export const getImageUrl = (imagePath) => {
  return `${baseURL}/images/${imagePath}`;
};

export default instance;
