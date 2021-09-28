<script lang="ts">
  import type { Box, Point } from "./model";

  import BoxView from "./Box.svelte";
  import { scale } from "./store";
  import Arrow from "./Arrow.svelte";

  let boxes: Box[] = [
    { x: 50, y: 50, width: 100, height: 150 },
    { x: 200, y: 250, width: 100, height: 150 },
  ];

  let svg: SVGSVGElement;

  let windowWidth = window.innerWidth;
  let windowHeight = window.innerHeight;

  let translateX = 0;
  let translateY = 0;

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
      translateY -= event.deltaY;
    }
  }

  function updateWindowSize() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
  }

  function onWheel(node: HTMLElement) {
    node.addEventListener("wheel", scaleOrTranslate, { passive: false });

    return {
      destroy() {
        node.removeEventListener("wheel", scaleOrTranslate);
      },
    };
  }
</script>

<svelte:window use:onWheel on:resize={updateWindowSize} />

<main>
  <div class="svg-container">
    <svg
      bind:this={svg}
      preserveAspectRatio="none"
      width="{windowWidth}px"
      height="{windowHeight}px"
      viewBox="0 0 {windowWidth} {windowHeight}"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        transform="matrix({$scale}, 0, 0, {$scale}, {translateX}, {translateY})"
      >
        <rect
          x="-100000"
          y="-100000"
          width="200000"
          height="200000"
          fill="white"
        />

        {#if svg}
          <g>
            {#if boxes.length >= 2}
              <Arrow from={boxes[0]} to={boxes[1]} />
            {/if}
          </g>

          <g>
            {#each boxes as box, idx}
              <BoxView
                {svg}
                {box}
                on:move={(e) => translateBox(idx, e.detail)}
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
</style>
