import axios from "axios";

let baseURL = "";

if (window.location.origin.includes("localhost")) {
  baseURL = "http://localhost:8080";
} else {
  baseURL = "https://marcos-90gs.onrender.com";
}

const instance = axios.create({
  baseURL,
});

export default instance;

export const getImageUrl = (imagePath) => {
  // Construct full URL for retrieving images
  return `${baseURL}/images/${imagePath}`;
};
