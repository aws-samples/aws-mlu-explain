<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<section>
  <!-- <h1 id="intro-hed">Backpropagation</h1> -->

  <h1 class="body-header">Backpropagation: How Networks Learn</h1>
  <hr />
  <p class="body-text">
    Neural networks have revolutionized the field of artificial intelligence and
    are the backbone of popular algorithms today, such as ChatGPT,
    Stable-Diffusion, and many others. In this visual and interactive article,
    we will explore the basics of neural networks, their architecture, and how
    they can be trained to solve a wide range of tasks.
  </p>
  <br />
  <br />
</section>

<style>
  section {
    padding-top: 5rem;
    /* padding-bottom: 5rem; */
    padding-left: 1rem;
    background-color: var(--darksquidink);
    color: var(--white);
  }
  #intro-hed {
    font-size: 2rem;
    margin-top: 5px;
    margin-bottom: 0;
    /* letter-spacing: 1.5px; */
    text-transform: uppercase;
    max-width: 100%;
    max-width: var(--max-width);
    margin: auto;
    color: var(--squidink);
    font-family: var(--font-heavy);
    /* text-align: left; */
  }

  .body-text,
  .body-header {
    color: var(--paper);
  }

  hr {
    width: var(--max-width);
    border: 1px solid var(--stone);
    opacity: 0.6;
  }
</style>
