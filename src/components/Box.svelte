<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { screenToSVG } from "../utils";
  import { scale } from "../store";
  import type { Point, Node } from "../model";

  const dispatch = createEventDispatcher<{ move: Point; createNewBox: void }>();

  export let svg: SVGSVGElement;
  export let box: Node;

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

  function createNewBox(): void {
    dispatch("createNewBox");
  }
</script>

<svelte:body
  on:mousemove={updateDrag}
  on:mouseleave={endDrag}
  on:mouseup={endDrag} />

<g>
  <rect
    on:mousedown={beginDrag}
    x={box.x}
    y={box.y}
    width={box.width}
    height={box.height}
    rx="15"
    class="box"
  />

  <g on:click={createNewBox} class="pill">
    <rect
      x={box.x + box.width - 32 - 8}
      y={box.y + 8}
      width={32}
      height={16}
      rx="8"
      class="pill__border"
    />

    <text x={box.x + box.width - 30} y={box.y + 20} class="pill__text">+</text>
  </g>
</g>

<style>
  .box {
    fill: var(--box-fill);
  }

  .box:hover {
    stroke: var(--primary-light);
    stroke-width: 2px;
  }

  .pill {
    cursor: pointer;
    user-select: none;
  }

  .pill:hover {
    stroke: var(--primary-light);
  }

  .pill__border {
    fill: var(--box-fill-2);
  }

  .pill__text {
    fill: var(--primary);
    stroke: var(--primary);
    font-size: 16px;
  }
</style>
