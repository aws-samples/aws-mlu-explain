<script>
  import Logo from "./Components/Logo.svelte";
  import Title from "./Components/Title.svelte";
  import Intro from "./Components/Intro.svelte";
  import KFoldInteractive from "./Components/KFoldInteractive.svelte";
  import Conclusion from "./Components/Conclusion.svelte";
  import Resources from "./Components/Resources.svelte";
  import ValidationSet from "./Components/ValidationSet.svelte";
  import KFoldCv from "./Components/KFoldCV.svelte";
  import LOOCV from "./Components/LOOCV.svelte";
  import BiasVariance from "./Components/BiasVariance.svelte";
</script>

<Logo />
<Title />
<Intro />
<ValidationSet />
<KFoldCv />
<LOOCV />
<KFoldInteractive />
<BiasVariance />
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
