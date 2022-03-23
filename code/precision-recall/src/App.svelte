<script>
  import Logo from "./Components/Logo.svelte";
  import Title from "./Components/Title.svelte";
  import Intro from "./Components/Intro.svelte";
  import ScrollViz from "./Components/ScrollViz.svelte";
  import F1Score from "./Components/F1Score.svelte";
  import Conclusion from "./Components/Conclusion.svelte";
  import Resources from "./Components/Resources.svelte";
  import ErrorLine from "./Components/ErrorLine.svelte";
</script>

<Logo />
<Title />
<Intro />
<ScrollViz />
<F1Score />
<ErrorLine />
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
