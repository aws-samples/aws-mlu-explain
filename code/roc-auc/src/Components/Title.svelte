<script>
  import { onMount } from "svelte";
  import { annotate } from "rough-notation";

  onMount(() => {
    const n1 = document.querySelector("#title-roc");
    const n2 = document.querySelector("#title-auc");

    const a1 = annotate(n1, {
      type: "highlight",
      color: "rgba(201, 32, 138, 0.7)",
      strokeWidth: 1,
      iterations: 1,
      multiline: true,
      animationDuration: 1000,
    });

    const a2 = annotate(n2, {
      type: "highlight",
      color: "rgba(124, 209, 234, 0.7)",
      strokeWidth: 1,
      iterations: 1,
      multiline: true,
      animationDuration: 1000,
    });

    setTimeout(() => {
      a1.show();
      a2.show();
    }, 450);
  });
</script>

<section id="intro">
  <h1 id="intro-hed">
    <span id="title-roc">ROC</span> <br />& <br /><span id="title-auc">AUC</span
    >
  </h1>
  <h1 class="intro-sub">
    A Visual Explanation of Receiver Operating Characteristic Curves and Area
    Under the Curve
  </h1>
  <h3 id="intro__date">
    <a href="https://twitter.com/jdwlbr">Jared Wilber</a>, June 2022
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
    letter-spacing: 15px;
    text-transform: uppercase;
    max-width: 100%;
    margin: auto;
    color: var(--squid-ink);
  }

  .intro-sub {
    font-size: 1.4rem;
    color: var(--squid-ink);
    text-align: center;
    margin: 1rem;
    opacity: 0.75;
    padding: 2rem;
    font-family: var(--font-main);
  }

  #intro__date {
    font-size: 1.1rem;
    color: var(--squid-ink);
    margin: 0px;
    margin-top: 15px;
    padding-bottom: 0px;
    margin-bottom: 0px;
    color: black;
    padding-bottom: 1rem;
    font-family: var(--font-main);
  }

  #intro__date a {
    color: var(--squid-ink);
    text-decoration: underline;
  }

  /* mobile */
  @media screen and (max-width: 950px) {
    #intro-hed {
      font-size: 3.5rem;
    }
  }
</style>
