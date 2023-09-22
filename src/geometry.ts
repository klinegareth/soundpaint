import { randn_bm } from "./utils.ts";
export interface Vector2D {
  x: number;
  y: number;
}
export interface Polygon {
  sides: number;
  size: number;
  center: Vector2D;
}
export const getPoints = (polygon: Polygon) => {
  const points: Array<Vector2D> = [];

  points.push({
    x: polygon.center.x + polygon.size * Math.cos(0),
    y: polygon.center.y + polygon.size * Math.sin(0),
  });

  for (let i = 1; i <= polygon.sides; i++) {
    const point: Vector2D = {
      x: Math.round(
        polygon.center.x +
          polygon.size * Math.cos((i * 2 * Math.PI) / polygon.sides),
      ),
      y: Math.round(
        polygon.center.y +
          polygon.size * Math.sin((i * 2 * Math.PI) / polygon.sides),
      ),
    };
    points.push(point);
  }
  return points;
};

const subdivide = (points: Vector2D[]) => {
  const doubledPoints: Array<Vector2D> = [];

  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    let midpoint: Vector2D = {
      x: (current.x + next.x) / 2,
      y: (current.y + next.y) / 2,
    };
    doubledPoints.push(current);
    doubledPoints.push(midpoint);
  }
  return doubledPoints;
};

const calculateNormal = (
  startPoint: Vector2D,
  endPoint: Vector2D,
): Vector2D => {
  const edgeVector: Vector2D = {
    x: endPoint.x - startPoint.x,
    y: endPoint.y - startPoint.y,
  };
  const normalVector: Vector2D = {
    x: edgeVector.y,
    y: -edgeVector.x,
  };

  // Normalize normal vector into unit vector
  const length = Math.sqrt(
    normalVector.x * normalVector.x + normalVector.y * normalVector.y,
  );
  normalVector.x /= length;
  normalVector.y /= length;
  return normalVector;
};

export const extrudeMidpoints = (points: Vector2D[], factor: number) => {
  let extrudedPoints: Vector2D[] = [];
  points = subdivide(points);
  for (let i = 0; i < points.length; i++) {
    if (i % 2 != 0) {
      const point = points[i];
      const startPoint = points[i - 1];
      const endPoint = points[(i + 1) % points.length];
      const normalVector = calculateNormal(startPoint, endPoint);
      const extrudedPoint: Vector2D = {
        x: point.x + normalVector.x * factor * randn_bm(),
        y: point.y + normalVector.y * factor * randn_bm(),
      };
      extrudedPoints.push(extrudedPoint);
    } else {
      extrudedPoints.push(points[i]);
    }
  }
  return extrudedPoints;
};
