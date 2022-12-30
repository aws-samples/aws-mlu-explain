<script>
  import Logo from "./Components/Logo.svelte";
  import Title from "./Components/Title.svelte";
  import Intro from "./Components/Intro.svelte";
  import ProblemStructure from "./Components/ProblemStructure.svelte";
  import Simulation from "./Components/Simulation.svelte";
  import Conclusion from "./Components/Conclusion.svelte";
  import Resources from "./Components/Resources.svelte";
  import {
    banditWidth,
    banditHeight,
    bananaScale,
    robotScale,
    arrowScale,
    gridHeight,
    gridWidth,
    gridMargin,
    lineWidth,
  } from "./data-store";
  // reset margin on resize
  function handleResize() {
    const size = window.innerWidth;

    if (size > 900 && size < 1200) {
      $gridHeight = 400;
      $gridWidth = 400;
      $gridMargin = {
        top: 8,
        bottom: 20,
        left: 16,
        right: 14,
      };
      $lineWidth = 100;
      $banditWidth = 430;
      $banditHeight = 200;
      $bananaScale = 0.13;
      $arrowScale = 0.09;
      $robotScale = 0.22;
    } else if (size < 900) {
      console.log("k");
      $gridHeight = 300;
      $gridWidth = 300;
      $gridMargin = {
        top: 8,
        bottom: 20,
        left: 16,
        right: 14,
      };
      $lineWidth = 70;
      $banditWidth = 330;
      $banditHeight = 150;
      $bananaScale = 0.1;
      $arrowScale = 0.07;
      $robotScale = 0.2;
    } else {
      $gridHeight = 500;
      $gridWidth = 500;
      $gridMargin = {
        top: 8,
        bottom: 20,
        left: 16,
        right: 15,
      };
      $lineWidth = 125;
      $banditWidth = 430;
      $banditHeight = 200;
      $bananaScale = 0.13;
      $arrowScale = 0.09;
      $robotScale = 0.22;
    }
  }
  handleResize();
</script>

<svelte:window on:resize={handleResize} />

<Logo />
<Title />
<Intro />
<ProblemStructure />
<Simulation />
<Conclusion />
<Resources />
