<script lang="ts">
  import type { Node, Edge, Point } from "../model";
  import { spring } from "svelte/motion";
  import { scale } from "../store";
  import Box from "./Box.svelte";
  import Arrow from "./Arrow.svelte";
  import { screenToSVG } from "../utils";

  const heights = spring(100);

  let boxes: Node[] = [
    { id: 0, x: 50, y: 50, width: 100, height: $heights },
    { id: 1, x: 50, y: 250, width: 100, height: $heights },
  ];

  let edges: Edge[] = [
    {
      from: 0,
      to: 1,
    },
  ];

  let svg: SVGSVGElement;

  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  let translate: Point = { x: 0, y: 0 };
  let isCompact = true;
  let isPanning = false;
  let panningStartPos: Point;
  let panningDelta: Point = { x: 0, y: 0 };

  heights.subscribe((h) => {
    boxes = boxes.map((b) => {
      const aboveCount = boxes.filter(
        (b2) => b.id !== b2.id && b2.y + b.height < b.y
      ).length;

      return { ...b, height: h, y: b.y + (h - b.height) * aboveCount };
    });
  });

  function createNewBox(from: Node): void {
    const id = boxes.length;
    const newBox = {
      id,
      width: from.width,
      height: from.height,
      x: from.x,
      y: from.y + from.height + 100,
    };

    while (checkIntersection(newBox)) {
      newBox.x += 70;
    }

    boxes.push(newBox);
    boxes = boxes;

    edges.push({
      from: from.id,
      to: id,
    });
  }

  function checkIntersection(box: Node): boolean {
    return boxes.some((b) => {
      const leftX = Math.max(box.x, b.x);
      const rightX = Math.min(box.x + box.width, b.x + b.width);
      const topY = Math.max(box.y, b.y);
      const bottomY = Math.min(box.y + box.height, b.y + b.height);

      return leftX < rightX && topY < bottomY;
    });
  }

  function translateBox(idx: number, to: Point): void {
    boxes[idx] = {
      ...boxes[idx],
      x: to.x,
      y: to.y,
    };
  }

  function scaleOrTranslate(event: WheelEvent): void {
    if (event.ctrlKey) {
      event.preventDefault();
      $scale -= event.deltaY * 0.0005;
    } else {
      translate = {
        x: translate.x,
        y: translate.y - event.deltaY,
      };
    }
  }

  function updateWindowSize() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
  }

  function handleMouseDown(event: MouseEvent): void {
    if (event.button === 1) {
      isPanning = true;
      panningStartPos = screenToSVG(svg, $scale, {
        x: event.clientX,
        y: event.clientY,
      });
    }
  }

  function handleMouseUp(event: MouseEvent): void {
    if (event.button === 1) {
      isPanning = false;

      translate = {
        x: translate.x + panningDelta.x,
        y: translate.y + panningDelta.y,
      };

      panningDelta = { x: 0, y: 0 };
    }
  }

  function handleMouseMove(event: MouseEvent): void {
    if (isPanning) {
      const mousePos = screenToSVG(svg, $scale, {
        x: event.clientX,
        y: event.clientY,
      });

      panningDelta = {
        x: mousePos.x - panningStartPos.x,
        y: mousePos.y - panningStartPos.y,
      };
    }
  }
</script>

<svelte:window
  on:wheel|nonpassive={scaleOrTranslate}
  on:resize={updateWindowSize}
  on:mousemove={handleMouseMove}
  on:mouseleave={handleMouseUp}
  on:mouseup={handleMouseUp}
/>

<main>
  <button
    class="compact-btn"
    on:click={() => {
      isCompact = !isCompact;
      heights.set(isCompact ? 100 : 150);
    }}>{isCompact ? "Expand" : "Compact"}</button
  >

  <div
    class="svg-container"
    class:svg-container--panning={isPanning}
    on:mousedown={handleMouseDown}
  >
    <svg
      bind:this={svg}
      preserveAspectRatio="none"
      width="{windowWidth}px"
      height="{windowHeight}px"
      viewBox="0 0 {windowWidth} {windowHeight}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        transform="matrix({$scale}, 0, 0, {$scale}, {translate.x +
          panningDelta.x}, {translate.y + panningDelta.y})"
      >
        <rect
          x="-100000"
          y="-100000"
          width="200000"
          height="200000"
          fill="var(--background)"
        />

        {#if svg}
          <g>
            {#each edges as edge}
              <Arrow from={boxes[edge.from]} to={boxes[edge.to]} />
            {/each}
          </g>

          <g>
            {#each boxes as box, idx}
              <Box
                {svg}
                {box}
                on:move={(e) => translateBox(idx, e.detail)}
                on:createNewBox={() => createNewBox(box)}
              />
            {/each}
          </g>
        {/if}
      </g>
    </svg>
  </div>
</main>

<style>
  main {
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .svg-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .svg-container--panning {
    cursor: move;
  }

  .compact-btn {
    position: fixed;
    top: 16px;
    right: 16px;
  }
</style>
