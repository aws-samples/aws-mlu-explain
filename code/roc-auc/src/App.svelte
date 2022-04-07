<script>
  import Meta from "./Meta.svelte";
  import Logo from "./Components/Logo.svelte";
  import Title from "./Components/Title.svelte";
  import Intro from "./Components/Intro.svelte";
  import Conclusion from "./Components/Conclusion.svelte";
  import Resources from "./Components/Resources.svelte";
  import ROCScroll from "./Components/ROCScroll.svelte";
  import ROCStatic from "./Components/ROCStatic.svelte";
  import AUCStatic from "./Components/AUCStatic.svelte";
</script>

<Meta />
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
