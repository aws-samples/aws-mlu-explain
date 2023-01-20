<script></script>

<section id="resources">
  <br />
  <h1>References + Open Source</h1>
  <p class="body-text">
    This article is a product of the following resources + the awesome people
    who made (and contributed to) them:
  </p>
  <br />

  <p class="resource-item">
    <a
      class="on-end"
      href="https://statmodeling.stat.columbia.edu/2022/01/27/regression-and-other-stories-free-pdf/"
      >[1] Regression And Other Stories</a
    ><br />
    (Gelman, Hill and Vehtari 2020).
  </p>
  <p class="resource-item">
    <a class="on-end" href="https://hastie.su.domains/Papers/ESLII.pdf"
      >[2] Elements of Statistical Learning</a
    ><br />
    (John Ross Quinlan, 1986).
  </p>

  <p class="resource-item">
    <a
      class="on-end"
      href="https://www.amazon.com/Mathematical-Statistics-Analysis-Available-Enhanced/dp/0534399428"
      >[3] Mathematical Statistics and Data Analysis</a
    ><br />
    (John A. Rice, 2010).
  </p>

  <p class="resource-item">
    <a class="on-end" href="https://d3js.org/">D3.js</a><br />(Mike Bostock &
    Philippe Rivière)
  </p>

  <p class="resource-item">
    <a class="on-end" href="https://katex.org/">KaTeX</a> <br />(Emily Eisenberg
    & Sophie Alpert)
  </p>
  <p class="resource-item">
    <a class="on-end" href="https://svelte.dev/">Svelte</a><br />(Rich Harris)
  </p>
  <br />
  <br />
  <br />
</section>

<style>
  /* overwrite */
  h1 {
    max-width: 600px;
    margin: auto;
    font-size: 2.6rem;
    margin-bottom: 2rem;
    background-color: var(--squidink);
    color: white;
    font-family: var(--font-mono);
  }

  #resources {
    background-color: var(--stone);
    color: var(--squidink);
    padding: 5rem;
  }

  .resource-item {
    max-width: 600px;
    margin: 0 auto;
    text-align: left;
    font-size: var(--size-default);
    line-height: 1.5em;
    font-family: "Amazon Ember";
    color: var(--squidink);
  }

  a.on-end {
    text-decoration: underline;
    ccolor: var(--darksquidink);
  }

  /* mobile */
  @media screen and (max-width: 950px) {
    .resource-item {
      max-width: 90%;
      font-size: 17px;
    }
  }
</style>
