<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { screenToSVG } from "./utils";
  import { scale } from "./store";
  import type { Point, Box } from "./model";

  const dispatch = createEventDispatcher<{ move: Point }>();

  export let svg: SVGSVGElement;
  export let box: Box;

  let isDragging = false;
  let boxPositionOnDragStart: Point;
  let dragStartPoint: Point = { x: 0, y: 0 };

  function beginDrag(event: MouseEvent) {
    if (!isDragging && event.buttons === 1) {
      isDragging = true;
      boxPositionOnDragStart = box;
      dragStartPoint = screenToSVG(svg, $scale, {
        x: event.clientX,
        y: event.clientY,
      });
    }
  }

  function updateDrag(event: MouseEvent): void {
    if (!isDragging) return;

    const mousePos = screenToSVG(svg, $scale, {
      x: event.clientX,
      y: event.clientY,
    });

    dispatch("move", {
      x: mousePos.x - (dragStartPoint.x - boxPositionOnDragStart.x),
      y: mousePos.y - (dragStartPoint.y - boxPositionOnDragStart.y),
    });
  }

  function endDrag(_event: MouseEvent): void {
    if (isDragging) {
      isDragging = false;
    }
  }
</script>

<svelte:body
  on:mousemove={updateDrag}
  on:mouseleave={endDrag}
  on:mouseup={endDrag} />

<rect
  on:mousedown={beginDrag}
  x={box.x}
  y={box.y}
  width={box.width}
  height={box.height}
  rx="15"
  class="box"
/>

<style>
  .box {
    fill: #6cce6c;
  }

  .box:hover {
    stroke: black;
    stroke-width: 1px;
  }
</style>
