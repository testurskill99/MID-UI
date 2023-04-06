import React, { useState } from "react";

function DenoiseTypesComponent(props) {
  const [selected, setSelected] = useState("adl");

  const handleClick = (val) => {
    setSelected(val);
    props.handleClick(val);
  };

  return (
    <div className="col-12 d-flex flex-row flex-wrap">
      <div className="col-3 px-2">
        <div
          onClick={() => handleClick("adl")}
          className={`${selected === "adl" ? "active " : ""}dType`}
          dtype="adl"
        >
          <img src={props.bgimage} alt="backgroud" width="100%" height="100%" />
        </div>
      </div>
      <div className="col-3 px-2">
        <div
          onClick={() => handleClick("median")}
          className={`${selected === "median" ? "active " : ""}dType`}
          dtype="median"
        >
          <img src={props.bgimage} alt="backgroud" width="100%" height="100%" />
        </div>
      </div>
      <div className="col-3 px-2">
        <div
          onClick={() => handleClick("mean")}
          className={`${selected === "mean" ? "active " : ""}dType`}
          dtype="mean"
        >
          <img src={props.bgimage} alt="backgroud" width="100%" height="100%" />
        </div>
      </div>
      <div className="col-3 px-2">
        <div
          onClick={() => handleClick("gaussian")}
          className={`${selected === "gaussian" ? "active " : ""}dType`}
          dtype="gaussian"
        >
          <img src={props.bgimage} alt="backgroud" width="100%" height="100%" />
        </div>
      </div>
    </div>
  );
}

export default React.memo(DenoiseTypesComponent);
