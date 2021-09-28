<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Point } from "./point";
  import { screenToSVG } from "./utils";

  const dispatch = createEventDispatcher<{ move: Point }>();

  export let svg: SVGSVGElement;
  export let x: number;
  export let y: number;

  let isDragging = false;
  let dragStartPoint: Point = { x: 0, y: 0 };
  let diff: Point = { x: 0, y: 0 };

  function beginDrag(event: MouseEvent) {
    if (!isDragging && event.buttons === 1) {
      isDragging = true;
      dragStartPoint = screenToSVG(svg, { x: event.screenX, y: event.screenY });
    }
  }

  function updateDrag(event: MouseEvent): void {
    if (!isDragging) return;

    const d = screenToSVG(svg, { x: event.screenX, y: event.screenY });

    diff = {
      x: d.x - dragStartPoint.x,
      y: d.y - dragStartPoint.y,
    };
  }

  function endDrag(_event: MouseEvent): void {
    if (isDragging) {
      isDragging = false;

      dispatch("move", { x: x + diff.x, y: y + diff.y });

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
  {x}
  {y}
  width="100"
  height="100"
  rx="15"
  transform="translate({diff.x}, {diff.y})"
  class="post"
/>

<style>
  .post {
    fill: #6cce6c;
  }

  .post:hover {
    stroke: black;
    stroke-width: 1px;
  }
</style>
