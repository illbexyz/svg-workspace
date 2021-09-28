<script lang="ts">
  import type { Box } from "./model";
  export let from: Box;
  export let to: Box;
</script>

<polyline
  points="{from.x + from.width / 2},{from.y + from.height / 2} {to.x +
    to.width / 2},{to.y + to.height / 2}"
  stroke="black"
/>

<style>
</style>
