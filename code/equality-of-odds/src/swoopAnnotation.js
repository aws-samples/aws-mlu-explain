// Calculates the swoopy path string based on input points
export function swoopAnnotation(points) {
  const [pointA, pointC, pointB] = points;

  const distanceAC = dist(pointA, pointC);
  const distanceCB = dist(pointC, pointB);
  const distanceAB = dist(pointA, pointB);

  const angle = Math.acos(
    (distanceAC * distanceAC +
      distanceCB * distanceCB -
      distanceAB * distanceAB) /
      (2 * distanceAC * distanceCB)
  );

  const radius = calculateRadius(distanceAC, distanceCB, distanceAB, angle);

  const largeArcFlag = +(Math.PI / 2 > angle);
  const sweepFlag = +(
    (pointB[0] - pointA[0]) * (pointC[1] - pointA[1]) -
      (pointB[1] - pointA[1]) * (pointC[0] - pointA[0]) <
    0
  );

  return createPath(pointA, radius, largeArcFlag, sweepFlag, pointB);
}

// Calculates the distance between two points
export function dist(point1, point2) {
  return Math.sqrt(
    Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2)
  );
}

// Calculates the radius of the circle based on the distances and angle
function calculateRadius(distanceAC, distanceCB, distanceAB, angle) {
  const K = 0.5 * distanceAC * distanceCB * Math.sin(angle);
  const r = (distanceAC * distanceCB * distanceAB) / (4 * K);
  return Math.round(r * 1000) / 1000;
}

// Creates the path string based on the input points, radius, and arc flags
function createPath(pointA, radius, largeArcFlag, sweepFlag, pointB) {
  return [
    "M",
    pointA,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    sweepFlag,
    pointB,
  ].join(" ");
}
