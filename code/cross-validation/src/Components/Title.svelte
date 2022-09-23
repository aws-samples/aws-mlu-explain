<script>
  import { onMount } from "svelte";
  import { annotate } from "rough-notation";

  onMount(() => {
    const n1 = document.querySelector(".title-cv");

    const a1 = annotate(n1, {
      type: "box",
      // color: "#f46ebb",
      strokeWidth: 5,
      iterations: 4,
      multiline: true,
      animationDuration: 1000,
    });

    setTimeout(() => {
      a1.show();
    }, 450);
  });
</script>

<section id="intro">
  <h1 id="intro-hed" class="title-cv">
    <span id="title-cv">Cross Validation</span>
  </h1>
  <h1 class="intro-sub">Reduce, Reuse, Resample</h1>
  <h3 id="intro__date">
    <a href="https://twitter.com/jdwlbr">Jared Wilber</a> &
    <a href="https://www.linkedin.com/in/jaspercroome/">Jasper Croome</a>, May
    2022
  </h3>
</section>

<style>
  #intro {
    max-width: 600px;
    margin: 1rem auto;
    text-align: center;
    padding-top: 1rem;
  }

  #intro-hed {
    font-size: 5rem;
    margin-top: 5px;
    margin-bottom: 0;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    max-width: 100%;
    margin: auto;
    color: var(--default);
  }

  .intro-sub {
    font-size: 1.4rem;
    color: var(--default);
    text-align: center;
    margin: 1rem;
    opacity: 0.75;
    padding: 2rem;
    font-family: var(--font-main);
  }

  #intro__date {
    font-size: 1.1rem;
    color: var(--default);
    margin: 0px;
    margin-top: 15px;
    padding-bottom: 0px;
    margin-bottom: 0px;
    color: black;
    padding-bottom: 1rem;
    font-family: var(--font-main);
  }

  #intro__date a {
    color: var(--primary);
    text-decoration: underline;
  }

  /* mobile */
  @media screen and (max-width: 950px) {
    #intro-hed {
      font-size: 3.5rem;
    }

    #intro-sub {
      font-size: 1.5rem;
    }
  }
</style>
