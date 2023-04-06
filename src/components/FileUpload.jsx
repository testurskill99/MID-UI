import React, { useEffect, useState } from "react";
import UploadService from "../services/FileUploadService";
import Button from "@mui/material/Button";
import CornerstoneViewport from "react-cornerstone-viewport";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import initCornerstone from "../initCornerStone";
import "./FileUpload.css";

import IconButton from "@mui/material/IconButton";
import ToggleButtons from "./ToggleButtons/ToggleButtons";
import NavbarComponent from "./Navbar";

import { urlInfo } from "../jsondata";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FaChevronDown } from "react-icons/fa";
import { BiErrorCircle, BiUpload } from "react-icons/bi";
import { MdInfo } from 'react-icons/md';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { FiMaximize, FiMinimize } from "react-icons/fi";
import BASliderComponent from "./ba_slider/BASlider";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

import DenoiseTypesComponent from "./shared-components/DenoiseTypes";
import { InputLabel } from "@mui/material";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: "100% !important",
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
  "&.MuiTooltip-popper": {
    zIndex: "10000 !important",
  },
}));

const ImageUpload = () => {
  const [currentFile, setCurrentFile] = useState(undefined);
  const [uploadAndPreviewImage, setUploadAndPreviewImage] = useState(false);
  const [denoisedImage, setDenoisedImage] = useState(null);
  const [desnoiseResult, setDenoiseResult] = useState(null);
  const [isImageDenoising, setIsImageDenoising] = useState(false);
  const [denoiseStatus, setDenoiseStatus] = useState("SUCCESS");
  const [isJpegOrPng, setIsJpegOrPng] = useState(true);
  const [isMaxView, setIsMaxView] = useState(false);
  const [denoiseType, setDenoiseType] = useState("adl"); // Dropdown Menu
  const [selectedItems, setSelectedItems] = useState("zoom"); // Tools selection
  const [alertOpen, setAlertOpen] = useState(false);
  const [mimeType, setMimeType] = useState("");
  const [filename, setFilename] = useState("");
  const [uploadedImageSrc, setuploadedImageSrc] = useState("");
  const [baSliderImages, setBaSliderImages] = useState({
    firstImage: null,
    secondImage: null
  });
  const [alertOption, setAlertOption] = useState({
    severity: "info",
    message: "",
    title: "info",
  });
  const tools = [
    // Mouse
    {
      name: "Wwwc",
      mode: "active", // "active | passive | enabled"
      modeOptions: { mouseButtonMask: 2 },
    },
    {
      name: "Zoom",
      mode: "active",
      modeOptions: { mouseButtonMask: 1 },
    },
    {
      name: "ArrowAnnotate",
      mode: "passive",
      modeOptions: { mouseButtonMask: 1 },
    },
    {
      name: "Pan",
      mode: "active",
      modeOptions: { mouseButtonMask: 4 },
    },
    // Scroll
    { name: "StackScrollMouseWheel", mode: "active" },
    // Touch
    { name: "PanMultiTouch", mode: "active" },
    { name: "ZoomTouchPinch", mode: "active" },
    { name: "StackScrollMultiTouch", mode: "active" },
  ];

  const [imageIds, setImageIds] = useState([]);

  const selectFile = (e) => {
    if (!e.target.files[0]) return false;
    const file = e.target.files[0];
    setMimeType(file.name.split(".")[1]);
    setFilename(file.name.split(".")[0]);
    setCurrentFile(file);
    setUploadAndPreviewImage(false);
    setIsImageDenoising(false);
    setDenoisedImage(null);
    // console.log(file.name);
  };

  // Upload image
  const uploadImage = () => {
    setUploadAndPreviewImage(true);
    UploadService.upload(currentFile)
      .then((response) => {
        const resData = response.data;
        initCornerstone(); // Initializing Cornerstone
        if (mimeType === "dcm") {
          setIsJpegOrPng(false);
          const image =
            cornerstoneWADOImageLoader.wadouri.fileManager.add(currentFile);
          setImageIds([image]);
          // const blobData = new Blob([currentFile]);
          // console.log(blobData);
          // setBaSliderImages((prevState) => ({
          //   ...prevState,
          //   secondImage: image.src,
          // }));
        } else {
          setIsJpegOrPng(true);
          const reader = new FileReader();
          reader.onload = async () => {
            // const element = await document.getElementById("cornerStoneImageB");
            const image = new Image();
            image.src = reader.result;
            image.onload = () => {
              // const cornerStone = window.cornerstone;
              // cornerStone.enable(element);
              setuploadedImageSrc(image.src);
              setBaSliderImages((prevState) => ({
                ...prevState,
                secondImage: image.src,
              }));
              // cornerStone
              //   .loadImage(image.src)
              //   .then((image) => {
              //     cornerStone.displayImage(element, image);
              //   })
              //   .catch((err) => {
              //     console.log(err);
              //     throw err;
              //   });
            };
          };
          reader.readAsDataURL(currentFile);
        }
        openAlert(resData.data, "success", "Success");
      })
      .catch((err) => {
        const error = err?.toJSON();
        openAlert(
          `${error?.message ? error?.message : "Server Error"}`,
          "error",
          "Error"
        );
        setCurrentFile(undefined);
      });
  };

  const handleDenoisingImage = (event) => {
    event.stopPropagation();
    setIsImageDenoising(true);
    const denoisePath = urlInfo.filter((murl) => murl.type === mimeType);
    const urlPath = `${denoisePath[0].url}/${filename}`;
    UploadService.denoiseImage(urlPath)
      .then((response) => {
        let imageData = response.data?.imageData
          ? response.data?.imageData
          : response.data;
        setDenoiseResult(response.data);
        let imageResult = `data:image/${mimeType};base64,${imageData}`;
        setIsImageDenoising(false);
        setDenoisedImage(imageResult); // set base64
        openAlert("Successfully Denoised", "success", "Denoised");
        setDenoiseStatus("SUCCESS");
        setBaSliderImages((prevState) => ({
          ...prevState,
          firstImage: imageResult,
        }));
      })
      .catch((err) => {
        openAlert(`${err?.message ? err?.message : err}`, "error", "Error");
        setIsImageDenoising(false);
        setDenoiseStatus("ERROR");
      });
  };
  // Cornerstone Tools active and passive
  const setPassive = (tool) => {
    window.cornerstoneTools.setToolPassive(tool);
  };
  const setActive = (tool, mouseButton) => {
    window.cornerstoneTools.setToolActive(tool, {
      mouseButtonMask: mouseButton,
    });
  };

  // Choose Denoise Type
  const handleChange = (event) => {
    setDenoiseType(event.target.value);
    // event.stopPropagation();
  };
  // Set comparison screen view
  const comparisonViewMode = (event) => {
    event.stopPropagation();
    setIsMaxView((prev) => !prev);
    const element = document.getElementById("imageSection");
    if (!document.fullscreenElement) {
      element.classList.add("fullScreen");
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      element.classList.remove("fullScreen");
      document.exitFullscreen();
    }
  };
  // Tools selection
  const handleToggle = (val) => {
    if (!val) {
      setPassive("Zoom");
      setPassive("ArrowAnnotate");
    }
    if (val === "annotate") {
      setActive("ArrowAnnotate", 1);
      setPassive("Zoom");
    }
    if (val === "zoom") {
      setActive("Zoom", 1);
      setPassive("ArrowAnnotate");
    }
    setSelectedItems(val);
  };
  // Open Alert
  const openAlert = (message, type, title) => {
    setAlertOpen(true);
    setAlertOption((prev) => {
      const newOption = {
        message: message,
        severity: type,
        title: title,
      };
      return newOption;
    });
  };

  // Handle denoise mode changes
  const handleDenoiseType = (val) => {
    const sliderElement = document.getElementsByClassName(
      "before-after-slider"
    );
    if (sliderElement[0]) sliderElement[0].classList.add("loading");
    const denoiseTypeURL = urlInfo.filter(
      (murl) => murl.type === "denoisemode"
    );
    const urlPath = `${denoiseTypeURL[0].url}/${filename}/${val}`;
    UploadService.getMethod(urlPath)
      .then((response) => {
        let imageData = response.data?.imageData
          ? response.data?.imageData
          : response.data;
        let imageResult = `data:image/${mimeType};base64,${imageData}`;
        setBaSliderImages((prevState) => ({
          ...prevState,
          firstImage: imageResult,
          psnr: response.data?.psnr
        }));
        if (sliderElement[0]) sliderElement[0].classList.remove("loading");
      })
      .catch((err) => {
        openAlert(`${err?.message ? err?.message : err}`, "error", "Error");
        if (sliderElement[0]) sliderElement[0].classList.remove("loading");
      });
  };

  // const downloadImage = () => {
  //   const cornerstone = window.cornerstone;
  //   const cornTool = window.cornerstoneTools;
  //   const enabledElement = cornerstone.getEnabledElementsByImageId(imageIds[0]);

  //   cornTool.
  //   console.log(crnImage);
  // };

  useEffect(() => {
    //  UploadService.getFiles().then((response) => {
    //    setImageInfos(response.data);
    //  }, []);
    // console.log(Tiff);
    return () => {
      URL.revokeObjectURL(denoisedImage);
    };
  }, [denoisedImage]);
  return (
    <div className="d-flex flex-column col px-0 bg-light">
      <NavbarComponent />
      <div className="col-12 px-0 d-flex flex-column uploadSection h-100">
        <div className="col-12 px-4">
          <div className="col-12">
            <div className="col-12 p-2 shadow-sm">
              <div className="col d-flex flex-row flex-wrap justify-content-center align-items-center">
                <div>
                  <input
                    className="form-control font-weight-bold uploadFileInput"
                    type="file"
                    id="formFile"
                    accept=".dcm, .png, .jpeg, .jpg"
                    onChange={selectFile}
                  />
                  {/* <div className="col-12 py-1 text-info text-xsmall d-flex align-items-center">
                    {["png", "jpeg", "jpg"].includes(mimeType) && (
                      <>
                        <BiInfoCircle size={16} className="mx-1" />
                        Zoom / Annotate supports only .DCM format.
                      </>
                    )}
                  </div> */}
                </div>
                <FormControl
                  sx={{ m: 1, width: 325 }}
                  size="small"
                  className="mt-0 mx-3"
                  variant="standard"
                >
                  <InputLabel>Choose Denoise Type</InputLabel>
                  <Select
                    value={denoiseType}
                    displayEmpty
                    onOpen={(e) => e.stopPropagation()}
                    onClose={(e) => e.stopPropagation()}
                    onChange={handleChange}
                  >
                    <MenuItem value={"adl"}>
                      Adversarial Distortion Learning (ADL)
                    </MenuItem>
                    <MenuItem
                      onClick={(e) => e.stopPropagation()}
                      value={"median"}
                      disabled
                    >
                      Median Denoising (CV2)
                    </MenuItem>
                    <MenuItem
                      onClick={(e) => e.stopPropagation()}
                      value={"mean"}
                      disabled
                    >
                      Mean Denoising (CV2)
                    </MenuItem>
                    <MenuItem
                      onClick={(e) => e.stopPropagation()}
                      value={"gaussian"}
                      disabled
                    >
                      Gaussian Denoising (CV2)
                    </MenuItem>
                    <MenuItem
                      onClick={(e) => e.stopPropagation()}
                      disabled
                      value={"bm3d"}
                    >
                      Block-Matching 3D (BM3D)
                    </MenuItem>
                  </Select>
                </FormControl>
                <Button
                  className="btn-ct"
                  variant="conatined"
                  startIcon={<BiUpload />}
                  disabled={!currentFile}
                  onClick={uploadImage}
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>
          {uploadAndPreviewImage && (
            <div className="col-12 mx-auto py-3" id="imageSection">
              <Accordion defaultExpanded={true} className="bg-light">
                <AccordionSummary
                  expandIcon={<FaChevronDown />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <span className="col-11 mx-auto px-4 d-flex justify-content-between">
                    <div className="d-flex align-items-center col-6 justify-content-start">
                      {/* <FormControl
                        sx={{ m: 1, width: 145 }}
                        size="small"
                      >
                        <Select
                          value={denoiseType}
                          displayEmpty
                          onOpen={(e) => e.stopPropagation()}
                          onClose={(e) => e.stopPropagation()}
                          onChange={handleChange}
                        >
                          <MenuItem disabled value="">
                            Denoise Type
                          </MenuItem>
                          <MenuItem
                            value={"ADL"}
                            title="Adversarial Distortion Learning for Denoising"
                          >
                            ADL
                          </MenuItem>
                          <MenuItem onClick={(e) => e.stopPropagation()} disabled value={"CV2"}>
                            CV2
                          </MenuItem>
                        </Select>
                      </FormControl> */}
                      <Button
                        className="btn-ct"
                        style={{ marginRight: "20px" }}
                        variant="conatined"
                        disabled={!currentFile}
                        onClick={handleDenoisingImage}
                      >
                        Denoise
                      </Button>
                      {!isJpegOrPng && (
                        <ToggleButtons
                          selectedItems={selectedItems}
                          handleToggle={handleToggle}
                        />
                      )}
                    </div>
                    <IconButton onClick={(e) => comparisonViewMode(e)}>
                      {isMaxView ? (
                        <FiMinimize size={20} title="Minimize view" />
                      ) : (
                        <FiMaximize size={20} title="Maximize view" />
                      )}
                    </IconButton>
                  </span>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="d-flex flex-row flex-nowrap justify-content-space-between col-lg-11 mx-auto">
                    <div className="col-6 px-4">
                      <h5>Before</h5>
                      {isJpegOrPng ? (
                        <>
                          <div
                            id="cornerStoneImageB"
                            style={{
                              minWidth: "100%",
                              height: "512px",
                              flex: "1",
                              border: "1px solid #0197f6",
                            }}
                          >
                            <img
                              width="100%"
                              height="512px"
                              lazy="true"
                              src={uploadedImageSrc}
                              alt="Uploaded"
                            />
                          </div>
                        </>
                      ) : (
                        <CornerstoneViewport
                          id="cornerStoneImageA"
                          tools={tools}
                          imageIds={imageIds}
                          style={{
                            minWidth: "100%",
                            height: "512px",
                            flex: "1",
                            border: "1px solid #0197f6",
                          }}
                        />
                      )}
                    </div>
                    <div className="col-6 px-4">
                      {isImageDenoising && (
                        <div className="d-flex justify-content-center flex-column align-items-center h-100">
                          <div
                            className="spinner-border spinner-border-md"
                            role="status"
                            aria-hidden="true"
                          ></div>
                          <font className="mt-3" size="4">
                            Denoising Image please wait...
                          </font>
                        </div>
                      )}
                      {denoisedImage && (
                        <div>
                          <h5 className="d-flex flex-row justify-content-between">
                            <span>After</span>
                            <span>
                              <span className="secondarySub">
                                Peak to Signal Noise Ratio
                              </span>
                              <HtmlTooltip
                                title={
                                  <HTMLtooltipContent
                                    htmlContent={desnoiseResult}
                                  />
                                }
                              >
                                <span>
                                  <MdInfo
                                    size={20}
                                    className="ct-color-primary crsr-pointer mx-2"
                                  />
                                </span>
                              </HtmlTooltip>
                            </span>
                          </h5>
                          <img
                            className="preview"
                            src={denoisedImage}
                            alt=""
                            lazy="true"
                            style={{
                              minWidth: "100%",
                              height: "512px",
                              flex: "1",
                              border: "1px solid #0197f6",
                            }}
                          />
                        </div>
                      )}
                      {denoiseStatus === "ERROR" && (
                        <div className="d-flex justify-content-center align-items-center h-100">
                          <h5 className="align-items-center justify-content-center d-flex">
                            <BiErrorCircle
                              size={24}
                              className="text-danger mr-3"
                            />
                            <font className="d-inline-block mx-2 text-danger">
                              Denoiser Error, Please try again
                            </font>
                          </h5>
                        </div>
                      )}
                    </div>
                    {/* <div>
                      <button onClick={downloadImage}>Download Image</button>
                    </div> */}
                  </div>
                </AccordionDetails>
              </Accordion>
              {denoisedImage && !isMaxView && (
                <Accordion className="bg-light" defaultExpanded={true}>
                  <AccordionSummary
                    expandIcon={<FaChevronDown />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography>Comparison Summary View</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {isJpegOrPng && (
                      <div className="col-4 mx-auto baSlider">
                        <BASliderComponent
                          firstImage={baSliderImages?.firstImage}
                          secondImage={baSliderImages?.secondImage}
                        />
                      </div>
                    )}
                    <div className="col-7 pt-4 mx-auto">
                      <h6 className="mb-3 d-flex flex-row justify-content-between">
                        <span>Output from different denoising techniques</span>
                        {/* <span className="px-2">PSNR : {baSliderImages?.psnr ?? '75.8'}</span> */}
                      </h6>
                      <DenoiseTypesComponent
                        bgimage={baSliderImages?.firstImage}
                        handleClick={handleDenoiseType}
                      />
                    </div>
                  </AccordionDetails>
                </Accordion>
              )}
            </div>
          )}
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        autoHideDuration={2000}
        key={"top right"}
      >
        <Alert severity={alertOption?.severity} variant="filled">
          {alertOption?.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

const HTMLtooltipContent = (args) => {
  const psnrUrl = urlInfo.find((fVal) => fVal.type === "psnr_url");
  return (
    <>
      <table className="table table-bordered mb-0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Resolution</th>
            <th>PSNR</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{args?.htmlContent?.imageName}</td>
            <td>{args?.htmlContent?.resolution}</td>
            <td className="text-center">
              {args?.htmlContent?.psnr.toString()}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="col-12 my-2" style={{ textAlign: "right" }}>
        <button type="button">
          <a href={psnrUrl.url} target="_blank" rel="noreferrer">
            Read more
          </a>
        </button>
      </div>
    </>
  );
};

export default ImageUpload;
