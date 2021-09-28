<script lang="ts">
  import type { Node, Point } from "./model";
  export let from: Node;
  export let to: Node;

  let startPoint: Point;
  let endPoint: Point;
  let anglePoint1: Point;
  let anglePoint2: Point;

  $: {
    startPoint = {
      x: from.x + from.width / 2,
      y: from.y + from.height,
    };

    endPoint = {
      x: to.x + to.width / 2,
      y: to.y,
    };

    anglePoint1 = {
      x: startPoint.x,
      y: startPoint.y + (endPoint.y - startPoint.y) / 2,
    };

    anglePoint2 = {
      x: endPoint.x,
      y: anglePoint1.y,
    };
  }
</script>

<defs>
  <marker
    id="arrow"
    viewBox="0 0 10 10"
    refX="10"
    refY="5"
    markerWidth="6"
    markerHeight="6"
    orient="auto-start-reverse"
    class="arrow-head"
  >
    <path d="M 0 0 L 10 5 L 0 10 z" />
  </marker>
</defs>

<polyline
  points="{startPoint.x},{startPoint.y} {anglePoint1.x},{anglePoint1.y} {anglePoint2.x},{anglePoint2.y} {endPoint.x},{endPoint.y}"
  stroke="black"
  fill="none"
  marker-end="url(#arrow)"
/>

<circle
  cx={anglePoint1.x + (anglePoint2.x - anglePoint1.x) / 2}
  cy={anglePoint1.y}
  r="7"
  class="middle-node"
/>

<style>
  polyline {
    stroke: var(--primary-light);
    stroke-width: 2px;
  }

  .middle-node {
    cursor: pointer;
    fill: var(--box-fill-2);
  }

  .middle-node:hover {
    stroke: var(--primary-light);
  }

  .arrow-head {
    fill: var(--primary-light);
  }
</style>
