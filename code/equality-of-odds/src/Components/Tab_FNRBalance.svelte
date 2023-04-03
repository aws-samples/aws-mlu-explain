<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
  import { format } from "d3-format";
  import {
    rectPos,
    wrongly_rejected_A,
    wrongly_rejected_B,
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

  $: updatePos = xScale(0.3);

  const formatter = format(".2f");

  $: eq1 = $wrongly_rejected_A / ($wrongly_rejected_A + 30);
  $: eq2 = $wrongly_rejected_B / ($wrongly_rejected_B + 10);
  $: eq3 = eq1 - eq2;
</script>

<p class="body-text">
  <span class="definition-header">False Negative Error Rate (FNR) Balance</span>
</p>
<br />
<p class="body-text">
  To calculate FNR balance, we work out FNR <sup
    ><span
      class="info-tooltip"
      title="Probability that a true positive will be miss-classified as negative."
      use:tooltip
      >[&#8505;]
    </span></sup
  >
  per group and take the difference; this measure is also called equal opportunity:
  <br />
  <br />
</p>
<p class="equation-text">  
  {@html katexify(
    `\\textrm{FNR}
    `,
    false
  )}<sub>
    <svg height="16" width="16">
      <circle
        cx="8"
        cy="10"
        r="4"
        stroke="black"
        stroke-width="1"
        fill="black"
      />
    </svg>
  </sub>

  {@html katexify(
    ` - \\, \\textrm{FNR} 
    `,
    false
  )}
  <sub>
    <svg height="10" width="10">
      <polygon points="5,0 0,10 10,10" style="fill:black;stroke-width:1" />
      Sorry, your browser does not support inline SVG.
    </svg></sub
  >
  {@html katexify(
    ` = 
  ${formatter(eq1)} - ${formatter(eq2)} = ${formatter(eq3)}
  `,
    false
  )}
  </p>
  <br />
  <p class="body-text">
  The resulting value will be in the range [-1, 1], the closer to 0 the closer to
  equal opportunity the groups are.
  <br /><br />
  Move the slider below or use the button to find the point of equal opportunity
  (or approximation) for our data.
</p>
<!-- To find out what percentage of students that should have received a grant missed out on actually receiving one. -->
<div class="button-container">
  <button on:click={() => ($rectPos = updatePos)}>Move Boundary to 0.30</button>
</div>

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
