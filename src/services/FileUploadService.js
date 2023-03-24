import http from "../http-common";
import axios from 'axios';

const upload = (file, onUploadProgress) => {
  let formData = new FormData();
  formData.append("file", file);
  return axios.post('http://localhost:5000/upload', formData)
};

const denoiseImage = (urlPath) => {
  return axios.get(`http://localhost:5000/denoise/${urlPath}`, {responseType: "json"})
};

const getFiles = () => {
  return http.get("/files");
};

const services = {
  upload,
  getFiles,
  denoiseImage
}

export default services;