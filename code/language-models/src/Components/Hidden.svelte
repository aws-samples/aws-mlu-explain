<script>
  export let shown = false;

  export const show = () => {
    shown = !shown;
  };
</script>

{#if shown}
  <slot />
{/if}

<style>
</style>
