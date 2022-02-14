<script>
  import Meta from "./Meta.svelte";
  import Logo from './Components/Logo.svelte'
  import Title from './Components/Title.svelte'
  import Intro from "./Components/Intro.svelte";
  import TextAndMathEquations from "./Components/TextAndMathEquations.svelte"
  import StaticChart from "./Components/StaticChart.svelte"
  import CenterScroll from "./Components/CenterScroll.svelte";
  import AAA from "./Components/AAA.svelte"
  import F1Score from "./Components/F1Score.svelte"
  import MultiClass from "./Components/MultiClass.svelte"
  import Recall from "./Components/Recall.svelte"
  import Vocabulary from "./Components/Vocabulary.svelte";
  import Conclusion from "./Components/Conclusion.svelte";
  import Resources from "./Components/Resources.svelte";
  import ConfusionMatrix from "./Components/ConfusionMatrix.svelte";

  
  </script>
    <Meta />
    <Logo />
    <Title />
    <Intro />
    <AAA />
    <F1Score />
    <!-- <Recall /> -->
    <!-- <Vocabulary /> -->
    <MultiClass />
    <Conclusion />
    <Resources />
   
  <!-- use lang="sass" for SASS -->
<style>
    :global(:root) {
    --squid-ink: #232F3E;
    --font-main: "Amazon Ember";
    --font-mono: "Amazon Ember Mono";
    --font-heavy: "Amazon Ember Display Heavy";
    --font-light: "Amazon Ember Display Light";
  }

  </style>
