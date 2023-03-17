import "./App.css";
import './assets/css/bootstrap.min.css'
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ImageUpload from "./components/FileUpload";

function App() {
  return (
    <div className="main-content">
      {/*<ImageUpload />*/}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image-upload" element={<ImageUpload />} />
      </Routes>
    </div>
  );
}

export default App;
