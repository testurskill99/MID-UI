import React from "react";
import "../assets/css/custom.css";
import { useNavigate, useLocation } from "react-router-dom";
import ctLogo from "../images/ct-logo.png";
import { FiArrowLeft } from "react-icons/fi";
import { FaArrowLeft, FaChevronLeft } from "react-icons/fa";
import { BsImages } from "react-icons/bs";
import Button from "@mui/material/Button";

const NavbarComponent = (props) => {
  let navigate = useNavigate();
  let location = useLocation();
  return (
    <div
      className={`w-100 ${
        location.pathname === "/image-upload"
          ? "ct-navbar-white"
          : "ct-navbar-dark"
      }`}
    >
      <div className="d-flex align-items-center w-100 justify-content-between">
        <div>
          <img
            alt="CT Logo"
            src={ctLogo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />
          <font size="4" className="mx-2 font-medium">Medical Image Enhancement</font>
        </div>
        <span>
          {location.pathname === "/image-upload" ? (
            <Button
              className="btn-ct"
              type="button"
              onClick={(e) => navigate("/")}
              startIcon={<FaArrowLeft size={14} style={{marginLeft: '5px'}} />}
            >
              Back to Home
            </Button>
          ) : (
            <Button
              className="btn-ct"
              type="button"
              onClick={(e) => navigate("/image-upload")}
              startIcon={<BsImages size={14} style={{marginLeft: '5px'}} />}
            > Try Denoiser now
            </Button>
          )}
        </span>
      </div>
    </div>
  );
};

export default NavbarComponent;
