export interface Point {
  x: number;
  y: number;
}

export interface Node {
  id: number;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface Edge {
  from: number;
  to: number;
}
