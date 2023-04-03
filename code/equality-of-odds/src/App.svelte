<script>
  import Logo from "./Components/Logo.svelte";
  import Title from "./Components/Title.svelte";
  import Intro from "./Components/Intro.svelte";
  import EODefinition from "./Components/EODefinition.svelte";
  import FairnessMeasure from "./Components/FairnessMeasure.svelte";
  import AchievingFairness from "./Components/AchievingFairness.svelte";
  import Conclusion from "./Components/Conclusion.svelte";
  import Resources from "./Components/Resources.svelte";
  import { margin } from "./store";

  function resizeMarginOnResize() {
    const mobile = window.innerWidth <= 1000;
    $margin = {
      top: mobile ? 40 : 55,
      bottom: mobile ? 20 : 10,
      left: mobile ? 50 : 80,
      right: 10,
    };
  }
  resizeMarginOnResize();
</script>

<svelte:window on:resize={resizeMarginOnResize} />
<Logo />
<Title />
<Intro />
<EODefinition />
<FairnessMeasure />
<AchievingFairness />
<Conclusion />
<Resources />
