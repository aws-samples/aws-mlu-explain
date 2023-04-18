<script>
  import katexify from "../katexify";
  import { tooltip } from "../tooltip";
  import { format } from "d3-format";
  import {
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
  per group and take the difference. It is also possible to rewrite this using TPR<sup
  ><span
    class="info-tooltip"
    title="TPR = 1 - FNR"
    use:tooltip
    >[&#8505;]
  </span></sup
>:
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
        stroke="var(--group_circles)"
        stroke-width="1"
        fill="var(--group_circles)"
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
      <polygon
        points="5,0 0,10 10,10"
        style="fill:var(--group_triangles);stroke-width:1"
      />
      Sorry, your browser does not support inline SVG.
    </svg></sub
  >
  {@html katexify(
    `= (1 \\,–\\, \\textrm{TPR}
    `,
    false
  )}
  <sub>
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
    `)\\,–\\,(1\\,–\\,\\textrm{TPR}
    `,
    false
  )}
  <sub>
    <svg height="10" width="10">
      <polygon
        points="5,0 0,10 10,10"
        style="fill:var(--group_triangles);stroke-width:1"
      />
      Sorry, your browser does not support inline SVG.
    </svg></sub
  >
  {@html katexify(
    `)=`,
    false
  )}
  <br> 
  <p class="equation-text">
    {@html katexify(
      `= \\textrm{TPR}
      `,
      false
    )}<sub>
      <svg height="10" width="10">
        <polygon
          points="5,0 0,10 10,10"
          style="fill:var(--group_triangles);stroke-width:1"
        />
        Sorry, your browser does not support inline SVG.
      </svg></sub
    >
    {@html katexify(
      ` - \\, \\textrm{TPR} 
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
    
</p>
<br />
<p class="body-text">
  The resulting value will be in the range [-1, 1], the closer to 0 the closer
  to equal opportunity the groups for EO equation where {@html katexify(
    ` y=1
    `,
    false
  )}.
</p>

<style>
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
