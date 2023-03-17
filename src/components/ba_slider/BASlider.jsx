import React from "react";
import ReactBeforeSliderComponent from "react-before-after-slider-component";
import "react-before-after-slider-component/dist/build.css";

function BASliderComponent(props) {
  const FIRST_IMAGE = {
    imageUrl: props.firstImage,
  };
  const SECOND_IMAGE = {
    imageUrl: props.secondImage,
  };
  return (
    <ReactBeforeSliderComponent
      firstImage={FIRST_IMAGE}
      secondImage={SECOND_IMAGE}
    />
  );
}

export default BASliderComponent;
