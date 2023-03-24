import React, { useEffect, useState } from "react";
import UploadService from "../services/FileUploadService";
import Button from "@mui/material/Button";
import CornerstoneViewport from "react-cornerstone-viewport";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
// import Tiff from "../assets/js/tiff.min.js";
import initCornerstone from "../initCornerStone";
import "./FileUpload.css";

import ToggleButtons from "./ToggleButtons/ToggleButtons";
import NavbarComponent from "./Navbar";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FaChevronDown } from "react-icons/fa";
import { BiErrorCircle, BiInfoCircle, BiUpload } from "react-icons/bi";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { IconButton } from "@mui/material";
import { FiMaximize, FiMinimize } from "react-icons/fi";
import BASliderComponent from "./ba_slider/BASlider";

import { TIFFViewer } from "react-tiff";
import "react-tiff/dist/index.css";

const ImageUpload = () => {
  const [currentFile, setCurrentFile] = useState(undefined);
  const [uploadAndPreviewImage, setUploadAndPreviewImage] = useState(false);
  const [denoisedImage, setDenoisedImage] = useState(null);
  const [desnoiseResult, setDenoiseResult] = useState(null);
  const [isImageDenoising, setIsImageDenoising] = useState(false);
  const [denoiseStatus, setDenoiseStatus] = useState("SUCCESS");
  const [isJpegOrPng, setIsJpegOrPng] = useState(true);
  const [isMaxView, setIsMaxView] = useState(false);
  const [denoiseType, setDenoiseType] = useState(""); // Dropdown Menu
  const [selectedItems, setSelectedItems] = useState("zoom"); // Tools selection
  const [alertOpen, setAlertOpen] = useState(false);
  const [mimeType, setMimeType] = useState("");
  const [filename, setFilename] = useState("");
  const [uploadedImageSrc, setuploadedImageSrc] = useState("");
  const [tiffFile, setTiffFile] = useState("");
  const [baSliderImages, setBaSliderImages] = useState({
    firstImage: null,
    secondImage: null,
  });
  const [alertOption, setAlertOption] = useState({
    severity: "info",
    message: "",
    title: "info",
  });
  const [tools, setTools] = useState([
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
  ]);

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
    console.log(file.name);
  };

  // ----------- Current local working demo
  // const uploadImage = () => {
  //   initCornerstone(); // Initializing Cornerstone
  //   setUploadAndPreviewImage(previewImage);
  // };

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
    const urlPath =
      mimeType === "dcm"
        ? `dcmtopng/${filename}`
        : mimeType === "png"
        ? `pngtopng/${filename}`
        : `getfile/${filename}`;
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
  }, []);
  return (
    <div className="d-flex flex-column col px-0 bg-light">
      <NavbarComponent />
      <div className="col-12 px-0 d-flex flex-column uploadSection h-100">
        <div className="col-12 px-4">
          <div className="col-12">
            {/* <div className="col-12 customCardHeader font-medium bg-light shadow-sm">
              Upload File to Denoise (.jpg, jpeg, .png, .dcm)
              Upload File to Denoise
            </div> */}
            <div className="col-12 p-2 shadow-sm">
              <div className="col d-flex flex-row flex-wrap justify-content-center align-items-start">
                <div>
                  <input
                    className="form-control font-weight-bold uploadFileInput"
                    type="file"
                    id="formFile"
                    accept=".dcm, .png, .jpeg, .jpg"
                    onChange={selectFile}
                  />
                  <div className="col-12 py-1 text-info text-xsmall d-flex align-items-center">
                    {["png", "jpeg", "jpg"].includes(mimeType) && (
                      <>
                        <BiInfoCircle size={16} className="mx-1" />
                        Zoom  / Annotate supports only .DCM format.
                      </>
                    )}
                  </div>
                </div>
                <FormControl
                  sx={{ m: 1, width: 145 }}
                  size="small"
                  className="mt-0"
                >
                  <Select
                    value={denoiseType}
                    displayEmpty
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
                    {/* <MenuItem value={"WLT"}>WLT</MenuItem> */}
                    {/* <MenuItem value={"CLT"}>CLT</MenuItem> */}
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
                          {mimeType !== "tiff" ? (
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
                                src={uploadedImageSrc}
                                alt="Uploaded"
                              />
                            </div>
                          ) : (
                            <TIFFViewer
                              style={{
                                minWidth: "100%",
                                height: "512px",
                                flex: "1",
                                border: "1px solid #0197f6",
                              }}
                              tiff={tiffFile}
                              lang="en"
                            />
                          )}
                        </>
                      ) : (
                        <>
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
                        </>
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
                          <h5>After</h5>
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
                <Accordion className="bg-light">
                  <AccordionSummary
                    expandIcon={<FaChevronDown />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography>Comparison Summary View</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {isJpegOrPng && (
                      <div className="col-4 mx-auto">
                        <BASliderComponent
                          firstImage={baSliderImages?.firstImage}
                          secondImage={baSliderImages?.secondImage}
                        />
                      </div>
                    )}
                    <div className="col-8 pt-4 mx-auto">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Resolution</th>
                            <th>Peak Signal Noise Ratio</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{desnoiseResult.imageName}</td>
                            <td>{desnoiseResult?.resolution}</td>
                            <td>{desnoiseResult.psnr.toString()}</td>
                          </tr>
                        </tbody>
                      </table>
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

export default ImageUpload;
