import React, { useEffect, useState } from "react";
import UploadService from "../services/FileUploadService";
import Button from "@mui/material/Button";
import CornerstoneViewport from "react-cornerstone-viewport";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import initCornerstone from "../initCornerStone";
import "./FileUpload.css";
// import axios from "axios";
// import { styled } from "@mui/material/styles";

// New Changes
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
import { BiUpload } from "react-icons/bi";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const ImageUpload = () => {
  const [currentFile, setCurrentFile] = useState(undefined);
  const [previewImage, setPreviewImage] = useState(undefined);
  const [uploadAndPreviewImage, setUploadAndPreviewImage] = useState(undefined);
  const [denoisedImage, setDenoisedImage] = useState(undefined);
  const [isImageDenoising, setIsImageDenoising] = useState(false);
  const [isJpegOrPng, setIsJpegOrPng] = useState(true);
  const [progress, setProgress] = useState(0);
  //  const [isPreviewBefore, setIsPreviewBefore] = useState(true);
  //  const [message, setMessage] = useState("");
  //  const [imageInfos, setImageInfos] = useState([]);
  // const [selectedIndex, setSelectedIndex] = useState("Denoising Type");
  const [denoiseType, setDenoiseType] = useState(""); // Dropdown Menu
  const [selectedItems, setSelectedItems] = useState("zoom"); // Tools selection
  const [alertOpen, setAlertOpen] = useState(false);
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

  // const handleSelect = (e) => {
  //   console.log("=-=-=-=-=-=-=-", e);
  //   setSelectedIndex(e);
  //   //setIsPreviewBefore(false);
  // };
  const selectFile = (e) => {
    const newIds = [];
    const image = cornerstoneWADOImageLoader.wadouri.fileManager.add(
      e.target.files[0]
    );
    // console.log("=====", e.target.files[0]);
    // console.log("What is image here : ", image);
    newIds.push(image);
    // console.log(newIds);
    setImageIds(newIds);
    setCurrentFile(e.target.files[0]);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
    // console.log("Preview Image : ", previewImage);
    if (e.target.files[0].type === "") {
      setIsJpegOrPng(false);
    }
    //setImageIds(URL.createObjectURL(e.target.files[0]));
    //console.log("Image id after file selection : ", imageIds);
    //setMessage("");
  };

  // ----------- Current local working demo
  // const uploadImage = () => {
  //   initCornerstone(); // Initializing Cornerstone
  //   setUploadAndPreviewImage(previewImage);
  // };
  const handleDenoisingImage = () => {
    setIsImageDenoising(true);
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(
          setIsImageDenoising(false),
          setDenoisedImage(uploadAndPreviewImage)
        );
      }, 2000)
    );
  };

  // const handleTabSelect = (ekey) => {
  //   console.log("type of tab event is : ", ekey);
  //   if (ekey === "before") {
  //     setPreviewImage(previewImage);
  //   } else {
  //     //  setImageInfos(imageInfo);
  //     setImageIds(imageIds);
  //     //  axios
  //     //    .get("../jsondata.js")
  //     //    .then((res) => {
  //     //      setImageInfos(res.data);
  //     //      console.log("data object : ", res.data);
  //     //    })
  //     //    .catch((err) => console.log(err));
  //   }
  // };
  //  const getDenoisedImage = async () => {
  //    await axios
  //      .get("/jsondata.json")
  //      .then((res) => {
  //        setImageInfos(res.data);
  //        console.log("data object : ", res.data);
  //      })
  //      .catch((err) => console.log(err));
  //  };

  const uploadImage = () => {
    UploadService.upload(currentFile, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        // setMessage(response.data.message);
        // return UploadService.getFiles();
        initCornerstone(); // Initializing Cornerstone
        openAlert(response.data, 'success', 'Success')
        setUploadAndPreviewImage(previewImage);
      })
      // .then((files) => {
      //   setImageInfos(files.data);
      // })
      .catch((err) => {
        // if (err.response && err.response.data && err.response.data.message) {
        //   setMessage(err.response.data.message);
        // } else {
        //   setMessage("Could not upload the Image!");
        // }
        openAlert(`${err?.message ? err?.message : 'Server Error'}`, 'error', 'Error')
        console.log(`Error: ${err}`);
        setCurrentFile(undefined);
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

  useEffect(() => {
    //  UploadService.getFiles().then((response) => {
    //    setImageInfos(response.data);
    //  }, []);
  }, []);
  return (
    <div className="d-flex flex-column col px-0 bg-light">
      <NavbarComponent />
      <div className="col-12 px-0 d-flex flex-column uploadSection h-100">
        <div className="col-12 px-4">
          <div className="col-12 customCard">
            <div className="col-12 customCardHeader font-medium bg-light shadow-sm">
              Upload File to Denoise (.jpg, jpeg, .png, .dcm)
            </div>
            <div className="col-12 p-2">
              <div className="col d-flex flex-row flex-wrap justify-content-center align-items-center">
                <div>
                  <input
                    className="form-control font-weight-bold"
                    type="file"
                    id="formFile"
                    accept=".jpg, .jpeg, .dcm, .png"
                    onChange={selectFile}
                  />
                </div>
                <FormControl sx={{ m: 1, width: 145 }} size="small">
                  <Select
                    value={denoiseType}
                    displayEmpty
                    onChange={handleChange}
                  >
                    <MenuItem disabled value="">
                      Denoise Type
                    </MenuItem>
                    <MenuItem value={"ADL"}>ADL</MenuItem>
                    <MenuItem value={"WLT"}>WLT</MenuItem>
                    <MenuItem value={"CLT"}>CLT</MenuItem>
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
                <Button
                  className="btn-ct mx-2"
                  variant="conatined"
                  disabled={!currentFile}
                  onClick={handleDenoisingImage}
                >
                  Denoise
                </Button>
              </div>
            </div>
          </div>
          {uploadAndPreviewImage && (
            <div className="col-12 mx-auto py-3">
              <Accordion defaultExpanded={true} className="bg-light">
                <AccordionSummary
                  expandIcon={<FaChevronDown />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className="text-ct-dark font-medium">
                    Image comparison viewer
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="col-12 py-2 d-flex justify-content-center">
                    <ToggleButtons
                      selectedItems={selectedItems}
                      handleToggle={handleToggle}
                    />
                  </div>
                  <div className="d-flex flex-row flex-nowrap justify-content-space-between col-lg-11 mx-auto">
                    <div className="col-6 px-4">
                      {uploadAndPreviewImage && (
                        <div>
                          <h5>Before</h5>
                          {isJpegOrPng ? (
                            <img
                              className="preview"
                              src={uploadAndPreviewImage}
                              alt=""
                              style={{
                                minWidth: "100%",
                                height: "512px",
                                flex: "1",
                                border: "1px solid #0197f6",
                              }}
                            />
                          ) : (
                            <CornerstoneViewport
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
                      )}
                    </div>
                    <div className="col-6 px-4">
                      {isImageDenoising ? (
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
                      ) : (
                        denoisedImage && (
                          <div>
                            <h5>After</h5>
                            {isJpegOrPng ? (
                              <>
                                <span>It's Jpeg | PNG</span>
                                <img
                                  className="preview"
                                  src={denoisedImage}
                                  alt=""
                                  style={{
                                    minWidth: "100%",
                                    height: "512px",
                                    flex: "1",
                                    border: "1px solid #0197f6",
                                  }}
                                />
                              </>
                            ) : (
                              <CornerstoneViewport
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
                        )
                      )}
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
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
        <Alert severity={alertOption?.severity}>
          <AlertTitle>{alertOption?.title}</AlertTitle>
          {alertOption?.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ImageUpload;
