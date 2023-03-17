import http from "../http-common";
import axios from 'axios';

const upload = (file, onUploadProgress) => {
  let formData = new FormData();
  formData.append("file", file);
  return axios.post('http://localhost:5000/upload', formData)
};

const getFiles = () => {
  return http.get("/files");
};

export default {
  upload,
  getFiles,
};
