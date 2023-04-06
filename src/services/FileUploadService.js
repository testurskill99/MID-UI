import axios from 'axios';

const upload = (file, onUploadProgress) => {
  let formData = new FormData();
  formData.append("file", file);
  return axios.post('http://10.100.8.140:5092/upload', formData)
};

const denoiseImage = (urlPath) => {
  return axios.get(`http://10.100.8.140:5092/denoise/${urlPath}`, {responseType: "json"})
};

const getMethod = (urlPath) => {
  return axios.get(`http://10.100.8.140:5092/${urlPath}`)
}

const postMethod = (urlPath, reqBody) => {
  return axios.post(`http://10.100.8.140:5092/${urlPath}`, reqBody)
}

const services = {
  upload,
  getMethod,
  postMethod,
  denoiseImage
}

export default services;