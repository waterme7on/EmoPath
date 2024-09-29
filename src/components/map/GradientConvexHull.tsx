import React from 'react';
import { Polygon, LatLng } from 'react-native-maps';
import { polygonHull } from 'd3-polygon';

interface GradientConvexHullProps {
  points: LatLng[];
  color: string;
  opacity?: number;
  strokeWidth?: number;
}

const createConvexHull = (points: LatLng[]): LatLng[] => {
    const pointsArray = points.map(p => [p.latitude, p.longitude]);
    const hull = polygonHull(pointsArray);
    return hull ? hull.map(p => ({ latitude: p[0], longitude: p[1] })) : [];
};

const GradientConvexHull: React.FC<GradientConvexHullProps> = ({
  points,
  color,
  opacity = 0.5,
  strokeWidth = 2
}) => {
  console.log('GradientConvexHull Props:', { points, color, opacity, strokeWidth });
  const hullPoints = createConvexHull(points);
  console.log('GradientConvexHull Props:', { hullPoints, color, opacity, strokeWidth });

  return (
    <Polygon
      coordinates={hullPoints}
      fillColor={`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`}
      strokeColor={color}
      strokeWidth={strokeWidth}
    />
  );
};

export default GradientConvexHull;
