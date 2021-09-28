<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { screenToSVG } from "./utils";
  import { scale } from "./store";
  import type { Point, Box } from "./model";

  const dispatch = createEventDispatcher<{ move: Point }>();

  export let svg: SVGSVGElement;
  export let box: Box;

  let isDragging = false;
  let dragStartPoint: Point = { x: 0, y: 0 };
  let diff: Point = { x: 0, y: 0 };

  function beginDrag(event: MouseEvent) {
    if (!isDragging && event.buttons === 1) {
      isDragging = true;
      dragStartPoint = screenToSVG(svg, $scale, {
        x: event.screenX,
        y: event.screenY,
      });
    }
  }

  function updateDrag(event: MouseEvent): void {
    if (!isDragging) return;

    const d = screenToSVG(svg, $scale, { x: event.screenX, y: event.screenY });

    diff = {
      x: d.x - dragStartPoint.x,
      y: d.y - dragStartPoint.y,
    };
  }

  function endDrag(_event: MouseEvent): void {
    if (isDragging) {
      isDragging = false;

      dispatch("move", { x: box.x + diff.x, y: box.y + diff.y });

      diff = { x: 0, y: 0 };
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
  transform="translate({diff.x}, {diff.y})"
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
