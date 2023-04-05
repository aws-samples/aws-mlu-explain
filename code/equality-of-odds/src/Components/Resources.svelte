<script></script>

<!-- <hr> -->
<br />
<br />
<br />
<section id="resources">
  <br />
  <h3 class="body-header">References + Open Source</h3>
  <p class="body-text">
    This article is a product of the following resources + the awesome people
    who made (and contributed to) them:
  </p>
  <br />

  <p class="resource-item">
    <a
      class="on-end"
      href="https://fairmlbook.org/"
      >[1] Fairness and Machine Learning
      </a
    ><br />
    (Solon Barocas, Moritz Hardt, Arvind Narayanan).
  </p>
  <p class="resource-item">
    <a
      class="on-end"
      href="https://arxiv.org/abs/1610.08452"
      >[2] Fairness Beyond Disparate Treatment & Disparate Impact: Learning Classification without Disparate Mistreatment
      </a
    ><br />
    (Muhammad Bilal Zafar, Isabel Valera, Manuel Gomez Rodriguez, Krishna P. Gummadi, 2016).
  </p>
  <p class="resource-item">
    <a
      class="on-end"
      href="https://arxiv.org/abs/1610.02413"
      >[3] Equality of Opportunity in Supervised Learning
      </a
    ><br />
    (Moritz Hardt, Eric Price, Nathan Srebro, 2016).
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
  p.body-text {
    color: white;
  }
  h3.body-header {
    text-decoration: underline;
    text-decoration-color: var(--bg);
  }
  #resources {
    background-color: var(--primary);
    color: white;
  }

  .resource-item {
    max-width: 600px;
    margin: 0 auto;
    text-align: left;
    font-size: var(--size-default);
    line-height: 1.5em;
    font-family: var(--font-light);
    color: white;
  }

  a.on-end {
    text-decoration: underline;
    color: white;
  }

  /* mobile */
  @media screen and (max-width: 950px) {
    .resource-item {
      max-width: 90%;
      font-size: 17px;
    }
  }
</style>
