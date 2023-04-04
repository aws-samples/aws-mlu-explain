<script>
  import katexify from "../katexify";
  import { format } from "d3-format";
  import { tooltip } from "../tooltip";
  import {
    rectPos,
    wrongly_accepted_A,
    wrongly_accepted_B,
    outerWidth,
    margin,
  } from "../store";
  import { scaleLinear } from "d3-scale";
  import { extent } from "d3-array";
  import { scatterData } from "../datasets";

  $: width = $outerWidth - $margin.left - $margin.right;

  $: xScale = scaleLinear()
    .domain(extent(scatterData.map((d) => d.xPos)))
    .range([$margin.left, width - $margin.right]);

  $: updatePos = xScale(0.75);

  const formatter = format(".2f");

  $: eq1 = $wrongly_accepted_A / ($wrongly_accepted_A + 20);
  $: eq2 = $wrongly_accepted_B / ($wrongly_accepted_B + 15);
  $: eq3 = eq1 - eq2;
</script>

<p class="body-text">
  <span class="definition-header">False Positive Error Rate (FPR) Balance</span>
</p>
<br />
<p class="body-text">
  To calculate FPR balance, we work out FPR
  <sup
    ><span
      class="info-tooltip"
      title="Percentage of false positives compared to all positive
        predictions."
      use:tooltip
      >[&#8505;]
    </span></sup
  >
  per group and take the difference:
  <br />
  <br />
</p>
<p class="equation-text">  
  {@html katexify(
    `\\textrm{FPR}
    `,
    false
  )}<sub>
    <svg height="16" width="16">
      <circle
        cx="8"
        cy="10"
        r="4"
        stroke="var(--group_circles)"
        stroke-width="1"
        fill="var(--group_circles)"
      />
    </svg>
  </sub>

  {@html katexify(
    ` - \\, \\textrm{FPR} 
    `,
    false
  )}
  <sub>
    <svg height="10" width="10">
      <polygon points="5,0 0,10 10,10" style="fill:var(--group_triangles);stroke-width:1" />
      Sorry, your browser does not support inline SVG.
    </svg></sub
  >
  <!-- {@html katexify(
    ` = 
  ${formatter(eq1)} - ${formatter(eq2)} = ${formatter(eq3)}
  `,
    false
  )} -->
  </p>
  <br /> 
  <p class="body-text">
  The resulting value will be in the range [-1, 1], the closer to 0 the more predictive
  equality the model achieves and we satisfy the EO equation where  {@html katexify(
    ` y=0
    `,
    false
  )}. 
  <!-- <br /><br />
  Move the slider below or use the button to find the best predictive equality (or
  approximation) for our data. -->
</p>
<!-- <div class="button-container">
  <button on:click={() => ($rectPos = updatePos)}>Move Boundary to 0.75</button>
</div> -->

<style>
  button {
    background-color: var(--bg);
    border: none;
    color: var(--squidink);
    padding: 12px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: var(--size-default);
    margin: 4px 2px;
    cursor: pointer;
    outline: 2px solid var(--squidink);
  }
  button:hover {
    color: var(--bg);
    background-color: var(--squidink);
  }

  .button-container {
    max-width: var(--max-width);
    display: flex;
    margin: 1rem auto;
    justify-content: center;
  }
  .definition-header {
    font-size: 0.85rem;
    font-family: var(--font-bold);
    text-decoration: underline;
  }

  @media screen and (max-width: 950px) {
    .definition-header {
      font-size: 0.8rem;
    }
  }
</style>
