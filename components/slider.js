// Adapted from https://codepen.io/andyNroses/pen/aYwBQb
import { useState, useEffect } from "react";

const Dot = ({ position }) => {
  return <div className={`dot dot-position-${position}`}></div>;
};

const DotHolder = ({ clickable, position, updatePosition }) => {
  const dotHolderStyle = clickable ? "dot-holder dot-holder-clickable" : "dot-holder";
  return <div className={dotHolderStyle} onClick={() => updatePosition(position)}></div>;
};

export const Slider = ({ size, length, clickable, onClick, index }) => {
  const [position, setPosition] = useState(index);
  useEffect(() => {
    setPosition(index);
  }, [index]);
  const updatePosition = (position) => {
    setPosition(position);
    onClick(position);
  };
  const generateDotHolders = () =>
    [...Array(length).keys()].map((i) => (
      <DotHolder
        key={i}
        position={i}
        clickable={clickable}
        size={size}
        updatePosition={updatePosition}
      />
    ));
  const dotHolders = generateDotHolders();
  return (
    <div className={`slider slider-${size}`}>
      <div className="dot-holders">{dotHolders}</div>
      <Dot position={position} />
    </div>
  );
};
