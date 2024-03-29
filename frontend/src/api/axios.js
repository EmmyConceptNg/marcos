import axios from "axios";

let baseURL = "";

if (window.location.origin.includes("localhost")) {
  baseURL = "http://localhost:8080";
} else {
  baseURL = "https://nathan-project-mgt.onrender.com";
}

export default axios.create({
  baseURL,
});

export const getImageUrl = (imagePath) => {
  // Construct full URL for retrieving images
  return `${baseURL}/api/user/${imagePath}`;
};
