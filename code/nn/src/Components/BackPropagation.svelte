<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
</script>

<section>
  <h1 id="intro-hed">BackPropagation</h1>
</section>

<style>
  section {
    max-width: 100%;
    padding-top: 5rem;
    /* padding-bottom: 5rem; */
    padding-left: 1rem;
    background-color: var(--darksquidink);
    color: var(--white);
  }

  .body-text {
    color: var(--white);
  }

  #intro-hed {
    font-size: 5.5rem;
    margin-bottom: 0;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    max-width: 100%;
    margin: auto;
    color: var(--white);
    text-align: right;
    padding-bottom: 2rem;
    padding-right: 1rem;
  }
  ul {
    max-width: 600px;
    margin: auto;
    color: var(--white);
    padding-top: 0.5rem;
  }
  li {
    padding: 0.25rem;
    list-style: none;
    color: var(--white);
  }
  /* mobile */
  @media screen and (max-width: 950px) {
    ul {
      max-width: 80%;
    }
    li {
      padding: 0.25rem 0;
    }
  }
</style>
