import React from "react";
import ReactBeforeSliderComponent from "react-before-after-slider-component";
import "react-before-after-slider-component/dist/build.css";

function BASliderComponent(props) {
  console.log(props);
  const FIRST_IMAGE = {
    imageUrl: props.firstImage,
  };
  const SECOND_IMAGE = {
    imageUrl: props.secondImage,
  };
  if (!props?.firstImage || !props?.secondImage)
    return <h6 className="text-center">No Images found!</h6>
  return (
    <ReactBeforeSliderComponent
      firstImage={FIRST_IMAGE}
      secondImage={SECOND_IMAGE}
    />
  );
}

export default React.memo(BASliderComponent);
