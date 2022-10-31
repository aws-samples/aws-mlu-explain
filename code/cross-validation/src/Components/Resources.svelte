<script></script>

<!-- <hr> -->
<br />
<br />
<br />
<section id="resources">
  <br />
  <h3 class="body-header">
    <span class="section-arrow">&gt; </span> References + Open Source
  </h3>
  <p class="body-text">
    This article is a product of the following resources + the awesome people
    who made (and contributed to) them:
  </p>
  <br />
  <p class="resource-item">
    <a class="on-end" href="https://dl.acm.org/doi/10.5555/1643031.1643047"
      >[1] A study of cross-validation and bootstrap for accuracy estimation and
      model selection</a
    ><br />
    (Ron Kohavi, 1995).
  </p>
  <p class="resource-item">
    <a class="on-end" href="https://hastie.su.domains/Papers/ESLII.pdf"
      >[2] Elements of Statistical Learning</a
    ><br />
    (Friedman, Tibshirani, and Hastie, 2001).
  </p>
  <p class="resource-item">
    <a
      class="on-end"
      href="https://www.jmlr.org/papers/volume5/grandvalet04a/grandvalet04a.pdf"
      >[3] No Unbiased Estimator of the Variance of K-Fold Cross-Validation</a
    ><br />
    (Yves Grandvalet & Yoshua Bengio, 2004)
  </p>
  <p class="resource-item">
    <a
      class="on-end"
      href="http://users.stat.umn.edu/~yangx374/papers/ACV_v30.pdf"
      >[4] Cross-Validation for Selecting a Model Selection Procedure</a
    ><br />
    (Yongli Zhang & Yuhong Yang, 2015).
  </p>
  <p class="resource-item">
    <a
      class="on-end"
      href="https://iri.columbia.edu/~tippett/cv_papers/Burman1989.pdf"
      >[5] A Comparative Study of Ordinary Cross-Validation, v-Fold
      Cross-Validation and the Repeated Learning-Testing Methods</a
    ><br />
    (Prabir Burman, 1989).
  </p>
  <p class="resource-item">
    <a
      class="on-end"
      href="https://statmodeling.stat.columbia.edu/2022/01/27/regression-and-other-stories-free-pdf/"
      >[6] Regression And Other Stories</a
    ><br />
    (Gelman, Hill and Vehtari 2020).
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
  .section-arrow {
    color: var(--squidink);
  }
  p.body-text {
    color: white;
  }
  #resources {
    background-color: var(--primary);
    color: white;
  }
  /* hr {
    margin: 2.5rem auto;
    max-width: 35rem;
  } */
  .resource-item {
    max-width: 600px;
    margin: 0 auto;
    text-align: left;
    font-size: 18px;
    line-height: 1.5em;
    font-family: "Amazon Ember";
    color: var(--white);
  }

  a.on-end {
    text-decoration: underline;
    color: var(--white);
  }

  /* mobile */
  @media screen and (max-width: 950px) {
    .resource-item {
      max-width: 80%;
      font-size: 17px;
    }
  }
</style>
