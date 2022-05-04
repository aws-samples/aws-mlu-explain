<!--
	@component
	Creates a key for ordinal scales on `zScale`.
 -->
<script>
  import { getContext } from "svelte";

  /** @type {String} [shape='square'] – The shape for each item. Can be 'circle', 'line', or 'square'; */
  export let shape = "circle";

  /** @type {String} [align='start'] – Sets the CSS flexbox justify-content setting for the box as a whole. Can be 'start', 'center' or 'end'. */
  export let align = "start";

  /** @type {Function|Object} [lookup] – Either a function that takes the value and returns a formatted string, or an object of values. If a given value is not present in a lookup object, it returns the original value. */
  export let lookup = undefined;

  /** @type {Boolean} [capitalize=true] - Capitalize the first character. */
  export let capitalize = true;

  const { zDomain, zScale } = getContext("LayerCake");

  function cap(val) {
    return String(val).replace(/^\w/, (d) => d.toUpperCase());
  }

  function displayName(val) {
    if (lookup) {
      return typeof lookup === "function" ? lookup(val) : lookup[val] || val;
    }
    return capitalize === true ? cap(val) : val;
  }
</script>

<div class="key">
  <p id="key-title">Class:</p>
  {#each $zDomain as item}
    <div class="key-item">
      <div class="chip chip__{shape}" style="background: {$zScale(item)};">
        {displayName(item) == "Positive" ? "+" : ""}
      </div>
      <div class="name">{displayName(item)}</div>
    </div>
  {/each}
</div>

<style>
  .key {
    display: flex;
    justify-content: start;
    align-items: center;
    vertical-align: middle;
  }
  .key-item {
    display: flex;
    margin-right: 12px;
    color: white;
    align-items: center;
    vertical-align: middle;
  }
  .chip {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 17px;
    height: 17px;
  }
  .chip__circle {
    border-radius: 50%;
    margin-right: 4px;
  }
  .chip__line:after {
    content: "";
    position: absolute;
    border-width: 3px;
    width: 15px;
    transform: rotate(-45deg);
    transform-origin: 14px 5px;
  }
  .name {
    display: inline;
    color: var(--squid-ink);
    font-size: 14px;
    font-family: var(--font-heavy);
  }
  #key-title {
    color: var(--squid-ink);
    font-size: 14px;
    font-family: var(--font-heavy);
    padding-right: 0.5rem;
  }

  @media screen and (max-width: 768px) {
  }
</style>
