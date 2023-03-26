<script>
  // import Logo from "./Components/Logo.svelte";
  // import Title from "./Components/Title.svelte";
  // import ActivationFunctions from "./Components/ActivationFunctions.svelte";
  // import Playground from "./Components/Playground.svelte";
  // import Resources from "./Components/Resources.svelte";
  import { margin, mobile } from "./store";
  // import NetworkScroll from "./Components/NetworkScroll.svelte";
  import BackPropagation from "./Components/BackPropagation.svelte";
  // import BackPropScroll from "./Components/BackPropScroll.svelte";
  // import NetworkChart from "./Components/NetworkChart.svelte";

  import Logo from "./Components/new/Logo.svelte";
  import Title from "./Components/new/Title.svelte";
  import Intro from "./Components/new/Intro.svelte";
  import NetworkScroll from "./Components/new/NetworkScroll.svelte";
  import ActivationFunctions from "./Components/new/ActivationFunctions.svelte";
  import Resources from "./Components/new/Resources.svelte";
  import BackProp from "./Components/new/BackProp.svelte";
  import VizNet from "./Components/new/VizNet.svelte";

  function handleResize() {
    $mobile = window.innerWidth <= 950;
    $margin = $mobile
      ? {
          top: 20,
          bottom: 18,
          left: 60,
          right: 30,
        }
      : {
          top: 20,
          bottom: 18,
          left: 95,
          right: 30,
        };
  }

  handleResize();
</script>

<svelte:window on:resize={handleResize} />

<Logo />
<!-- <Title />
<Intro />
<NetworkScroll />
<ActivationFunctions />
<BackPropagation />
<BackProp /> -->
<VizNet />
<!-- <CommonArchitectures /> -->
<Resources />
