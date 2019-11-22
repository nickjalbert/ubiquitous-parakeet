function calculateLeftPx(xPos, elWidth) {
  const containerWidth = 700;
  const positionMultiplier = 100;
  const halfElWidth = elWidth / 2;
  const halfContainerWidth = containerWidth / 2;
  const elCenter = halfContainerWidth + (positionMultiplier * xPos);
  return elCenter - halfElWidth;
}

export default calculateLeftPx;
