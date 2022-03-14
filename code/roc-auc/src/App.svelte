<script>
  import Meta from "./Meta.svelte";
  import Logo from './Components/Logo.svelte'
  import Title from './Components/Title.svelte'
  import Intro from "./Components/Intro.svelte";
  import Conclusion from "./Components/Conclusion.svelte";
  import Resources from "./Components/Resources.svelte";
  import ROCScroll from "./Components/ROCScroll.svelte";
  import ROCStatic from "./Components/ROCStatic.svelte";
  import AUCInteractive from "./Components/AUCInteractive.svelte";
  import AUCStatic from "./Components/AUCStatic.svelte";
import AucInteractive from "./Components/AUCInteractive.svelte";
  
    export let name;
  
    function toggleName() {
      if (name === 'world') {
        name = 'Jared'
      } else {
        name = 'World'
      }
    }
    console.log('hey')
  </script>
    <Meta />
    <Logo />
    <Title />
    <Intro />
    <ROCScroll />
   <ROCStatic />
   <AUCStatic />
   <AucInteractive />
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
