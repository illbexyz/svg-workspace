<script lang="ts">
  import type { Point } from "./point";

  import Post from "./Post.svelte";

  let postPos = { x: 0, y: 0 };
  let svg: SVGSVGElement;

  let scale = 1;
  let translateX = 20;
  let translateY = 20;

  function move({ detail }: CustomEvent<Point>): void {
    postPos = detail;
  }

  function wheel(event: WheelEvent): void {
    if (event.ctrlKey) {
      event.preventDefault();
      scale -= event.deltaY * 0.0005;
    } else {
      translateY -= event.deltaY;
    }
  }

  function wheelw(node: HTMLElement) {
    node.addEventListener("wheel", wheel, { passive: false });

    return {
      destroy() {
        node.removeEventListener("wheel", wheel);
      },
    };
  }
</script>

<svelte:window use:wheelw />

<div class="main">
  <div class="svg-container">
    <svg
      bind:this={svg}
      preserveAspectRatio="none"
      width="1920px"
      height="1080px"
      viewBox="0 0 1920 1080"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="matrix({scale}, 0, 0, {scale}, {translateX}, {translateY})">
        <rect
          x="-100000"
          y="-100000"
          width="200000"
          height="200000"
          fill="white"
        />

        {#if svg}
          <g>
            <Post {svg} x={postPos.x} y={postPos.y} on:move={move} />
          </g>
        {/if}
      </g>
    </svg>
  </div>
</div>

<style>
  .main {
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
