<script>
  import { mobile } from "./data-store";
  import Meta from "./Meta.svelte";
  import Logo from "./Components/Logo.svelte";
  import Title from "./Components/Title.svelte";
  import Intro from "./Components/Intro.svelte";
  import Evaluation from "./Components/Evaluation.svelte";
  import GradientDescent from "./Components/GradientDescent.svelte";
  import Coefficients from "./Components/Coefficients.svelte";
  import Interpretations from "./Components/Interpretations.svelte";
  import Conclusion from "./Components/Conclusion.svelte";
  import Resources from "./Components/Resources.svelte";
  import ScrollSide from "./Components/ScrollSide.svelte";

  function handleResize() {
    $mobile = window.innerWidth <= 700;
  }

  handleResize();
</script>

<svelte:window on:resize={handleResize} />

<Meta />
<Logo />
<Title />
<Intro />
<ScrollSide />
<Evaluation />
<Coefficients />
<Interpretations />
<Conclusion />
<Resources />
