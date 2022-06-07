<script>
  import Logo from "./Components/Logo.svelte";
  import Title from "./Components/Title.svelte";
  import Intro from "./Components/Intro.svelte";
  import Conclusion from "./Components/Conclusion.svelte";
  import Resources from "./Components/Resources.svelte";
  import ROCScroll from "./Components/ROCScroll.svelte";
  import ROCStatic from "./Components/ROCStatic.svelte";
  import AUCStatic from "./Components/AUCStatic.svelte";
  import {
    margin,
    marginScroll,
    radius,
    collision,
    iconScale,
  } from "./data-store.js";

  // reset margin on resize
  function handleResize() {
    const mobile = window.innerWidth <= 700;

    $margin = {
      top: mobile ? 40 : 50,
      bottom: mobile ? 20 : 25,
      left: mobile ? 50 : 70,
      right: 10,
    };

    $marginScroll = {
      top: mobile ? 10 : 12,
      bottom: mobile ? 15 : 18,
      left: mobile ? 40 : 50,
      right: mobile ? 15 : 35,
    };

    $radius = mobile ? 0 : 5;
    $collision = mobile ? 10 : 14;
    $iconScale = mobile ? 0.032 : 0.04;
  }

  handleResize();
</script>

<svelte:window on:resize={handleResize} />

<Logo />
<Title />
<Intro />
<ROCScroll />
<ROCStatic />
<AUCStatic />
<Conclusion />
<Resources />

<style>
  :global(:root) {
    --squid-ink: #232f3e;
    --font-main: "Amazon Ember";
    --font-mono: "Amazon Ember Mono";
    --font-heavy: "Amazon Ember Display Heavy";
    --font-light: "Amazon Ember Display Light";
  }
</style>
