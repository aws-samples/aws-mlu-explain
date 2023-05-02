<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
  import Table from "./Table.svelte";
</script>

<section>
  <hr />
  <h1>Going Forward: Other Neural Network Architectures</h1>
  <p class="body-text">
    Up to this point, we've describe a specific neural network architecture
    where values flow forward linearly through a network, and gradients flow
    linearly backwards through a network. These are often referred to as feed
    <span class="bold">forward neural networks</span>, or
    <span class="bold">artificial neural networks</span> (the word 'artificial' comes
    from the network's composition of artificial neurons). However, this is just
    the tip of the iceberg when it comes to the field of neural networks. While artificial
    neural networks have been incredibly successful in a wide range of applications,
    many other types of neural network architectures exist that can be used to solve
    different types of problems. In this section, we will briefly explore some of
    the other network architectures that are commonly used and why they are necessary
    for solving different types of problems.
  </p>
</section>

<style>
  h1 {
    max-width: 600px;
    margin: auto;
  }
  ul {
    max-width: 600px;
    margin: auto;
    color: var(--squid-ink);
    padding-top: 0.5rem;
  }
  li {
    padding: 0.25rem;
    list-style: none;
    color: var(--squid-ink);
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
