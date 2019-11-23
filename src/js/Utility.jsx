function calculateLeftPx(xPos, elWidth) {
  const containerWidth = 700;
  const positionMultiplier = 100;
  const halfElWidth = elWidth / 2;
  const halfContainerWidth = containerWidth / 2;
  const elCenter = halfContainerWidth + (positionMultiplier * xPos);
  return elCenter - halfElWidth;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  const floorMin = Math.ceil(min);
  const floorMax = Math.floor(max);
  return Math.floor(Math.random() * (floorMax - floorMin)) + floorMin;
}

export {
  calculateLeftPx,
  getRandomInt,
};
