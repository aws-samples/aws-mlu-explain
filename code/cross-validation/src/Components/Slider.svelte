<script>
  import { format } from "d3-format";
  export let label;
  export let value;

  const formatter = format(".2f");
</script>

<div class="slider-holder">
  <p>{label}: {formatter($value)}</p>
  <input
    bind:value={$value}
    type="range"
    min="0.0"
    max="1"
    maxlength="20"
    step="0.05"
  />
</div>

<style>
  .slider-holder {
    margin: auto;
    width: 80%;
  }
  p {
    margin: 5px auto;
    font-size: 1.11rem;
    font-family: var(--font-heavy);
  }
  input {
    width: 100%;
    margin-bottom: 2rem;
  }
  input[type="range"] {
    -webkit-appearance: none;
    background: #d4dada;
    background: #7e93ee;
    width: 100%;
    height: 10px;
    /* border: 1px solid #232F3E; */
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: #232f3e;
    /* opacity: 0.85; */
    width: 10px;
    height: 20px;
  }

  /* mobile */
  @media screen and (max-width: 950px) {
    .slider-holder {
      width: 80%;
    }
  }
</style>
