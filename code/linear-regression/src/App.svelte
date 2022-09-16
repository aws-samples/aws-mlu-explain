<script>
  import Logo from "./Components/Logo.svelte";
  import Title from "./Components/Title.svelte";
  import Intro from "./Components/Intro.svelte";
  import Interpretation from "./Components/Interpretation.svelte";
  import Resources from "./Components/Resources.svelte";
  import GradientDescent from "./Components/GradientDescent.svelte";
  import MeanSquaredError from "./Components/MeanSquaredError.svelte";
  import ScrollyRegression from "./Components/ScrollyRegression.svelte";
  import Assumptions from "./Components/Assumptions.svelte";
  import Extensions from "./Components/Extensions.svelte";
  import ClosedForm from "./Components/ClosedForm.svelte";
  import { margin, mobile } from "./store";

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
<Title />
<Intro />
<ScrollyRegression />
<MeanSquaredError />
<GradientDescent />
<ClosedForm />

<Interpretation />
<Assumptions />
<Extensions />
<Resources />
