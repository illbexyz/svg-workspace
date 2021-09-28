import type { Point } from "./point";

export function screenToSVG(svg: SVGSVGElement, { x, y }: Point): Point {
  let pt = svg.createSVGPoint();

  pt.x = x;
  pt.y = y;

  pt = pt.matrixTransform(svg.getScreenCTM()?.inverse());

  return {
    x: pt.x,
    y: pt.y,
  };
}
