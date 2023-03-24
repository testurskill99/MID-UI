import React from "react";
import { BsImages } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

function TryDenoiseButtonComponent() {
  let navigate = useNavigate();
  return (
    <div>
      <Button
        className="btn-ct"
        type="button"
        onClick={(e) => navigate("/image-upload")}
        startIcon={<BsImages size={14} style={{ marginLeft: "5px" }} />}
      >
        {" "}
        Try Denoiser now
      </Button>
    </div>
  );
}

export default TryDenoiseButtonComponent;
