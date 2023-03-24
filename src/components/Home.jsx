import React from "react";
import "./Home.css";
import NavbarComponent from "./Navbar";
import { BsImages } from "react-icons/bs";
import BASliderComponent from "./ba_slider/BASlider";
import image1 from "../images/slider/c.jpg";
import image2 from "../images/slider/d.jpg";

const Home = () => {
  return (
    <div className="min-h-100 d-flex flex-column col px-0">
      <NavbarComponent />
      <div className="sections w-100">
        <section className="section-a pb-5">
          <div className="d-flex flex-row align-items-center">
            <div className="col-lg-6 col-md-10 col-12 mx-auto">
              <font className="font-medium title text-white d-flex justify-content-start align-items-center">
                A Tool for Medical Image Denoising
                <BsImages className="mx-2 pt-2" size={32} />
              </font>
              <p className="text-justify font-regular pt-4 subTitle text-white">
                A medical image denoiser is a computational tool used to reduce
                noise in medical images. It is software alogrithm that applies
                various mathematical and statistical methods to eliminate
                unwanted artificats and enhance the visual quality of the image.
              </p>
            </div>
            <div className="col-5 mx-auto pt-4">
              <div className="col-11 px-2">
                <BASliderComponent
                  delimiterColor="#a3a4a3"
                  withResizeFeel="true"
                  firstImage={image2}
                  secondImage={image1}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="section-b">
          <div className="col-lg-10 col-12 mx-auto">
            <h2 className="text-center font-medium title text-ct-dark pb-4">
              <font className="centerBorder">Enhancement Services</font>
            </h2>
            <div className="col-12 d-flex flex-row flex-wrap">
              <div className="col-4 p-2">
                <div className="service col-12">
                  <font size="4" className="font-medium my-2 d-block">
                    Annotate
                  </font>
                  <p className="text-ct-dark secondarySub font-regular">
                    It allows users to add text, arrow, and other annotations to
                    medical images for easy communation and collabortion.
                  </p>
                </div>
              </div>
              <div className="col-4 p-2">
                <div className="service col-12">
                  <font size="4" className="font-medium my-2 d-block">
                    Contrast Enhancement
                  </font>
                  <p className="text-ct-dark secondarySub font-regular">
                    This tool enhances the contrast of medical images to improve
                    image clarity and detail.
                  </p>
                </div>
              </div>
              <div className="col-4 p-2">
                <div className="service col-12">
                  <font size="4" className="font-medium my-2 d-block">
                    Comparison
                  </font>
                  <p className="text-ct-dark secondarySub font-regular">
                    It provides side-by-side comparisons of medical images
                    before and after denoising, contrast enhancement, and other
                    processing tenchniques.
                  </p>
                </div>
              </div>
              <div className="col-4 p-2">
                <div className="service col-12">
                  <font size="4" className="font-medium my-2 d-block">
                    Zoom In/Out
                  </font>
                  <p className="text-ct-dark secondarySub font-regular">
                    This tool allows users to zoom in and out of images for
                    closer examination.
                  </p>
                </div>
              </div>
              <div className="col-4 p-2">
                <div className="service col-12">
                  <font size="4" className="font-medium my-2 d-block">
                    Pan
                  </font>
                  <p className="text-ct-dark secondarySub font-regular">
                    This tool allows users to drag images into any position to
                    view particular section when the image is scaled.
                  </p>
                </div>
              </div>
              <div className="col-4 p-2">
                <div className="service col-12">
                  <font size="4" className="font-medium my-2 d-block">
                    Export
                  </font>
                  <p className="text-ct-dark secondarySub font-regular">
                    This tool allows users to export denoised medical images in
                    a variety of formats, inclusing DICOM and JPEG.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="section-c">
          <div className="col-lg-10 col-12 mx-auto">
            <h2 className="text-center font-medium title text-ct-dark pb-5">
              <font className="centerBorder">Other Services</font>
            </h2>
          </div>
        </section> */}
        <section className="section-d bg-light">
          <div className="col-12 px-0 py-2 text-center">
            <font size="2">Copyright © 2023 Medical Image Denoiser by Citiustech. All Rights Reserved.</font>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
