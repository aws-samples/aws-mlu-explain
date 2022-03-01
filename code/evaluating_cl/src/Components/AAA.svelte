<script>
  import { getContext } from 'svelte';
  import Scrolly from "./Scrolly.svelte";
  import Scatterplot from "./Scatterplot.svelte";
  import katexify from '../katexify';
  import ConfusionMatrix from './ConfusionMatrix.svelte';
  import { TP, FP, TN, FN, stage } from './data-store.js';
  import { LayerCake, Svg, Html } from 'layercake';
	import { scaleOrdinal } from 'd3-scale';
  import { select, selectAll } from "d3-selection";

	import Key from './Key-html.svelte';
	import AxisX from './BeeswarmAxisX.svelte';
  import AxisY from "./AxisY.svelte"
	import Beeswarm from './BeeswarmForce.svelte';
  import DecisionBoundary from "./DecisionBoundary.svelte";

	import { scatterData } from './datasets.js';

	const xKey = 'weight';
	const yKey = 'weight';
	const zKey = 'outcome';
	const titleKey = 'gender';

	const r = 12;

	const seriesNames = new Set();
	const seriesColors = ['#7e93ee', '#ff99ff'];

	const dataTransformed = scatterData.map(d => {
		seriesNames.add(d[zKey]);

		return {
			[titleKey]: d[titleKey],
			[zKey]: d[zKey],
			[xKey]: +d[xKey],
			[yKey]: +d[yKey]
		}
	});


  // 
  // Article Text
  // 

  // Track metrics
  $: accuracy = ($TP + $TN) / ($TP + $TN + $FP + $FN)
  $: precision = $TP / ($TP + $FP)
  $: recall = $TP / ($TP + $FN) 
	
  // scroll iterator
  let value;


  // Paragraph text for scrolly
  $: steps = [
		 `<h1>Accuracy</h1>
     <p>Our Diabetes classifier is quite simple, classifying patients with AIc greater than 3.5 as Positive for Diabetes, otherwise negative.
      We can easily measure the accuracy of our model using the following equation:<br><br>
      ${katexify(`\\begin{aligned} \\frac{TP + TN}{TP + FP + TN + FN} = \\frac{${$TP + $TN} }{${$TP + $FP + $TN + $FN}} \\end{aligned}`)} 
       ${katexify(`\\approx ${Math.round(accuracy * 100)}\\%`)}
       <br><br>
      This gives our model an accuracy of ${$TP}% on our imbalanced data, which isn't too bad!
      </p>`,
      `<h1>Problems</h1>
      <p>However, a big issue with our data (and common amongst many classification tasks) is imbalance: our data has three times the amount of negative examples than positive.
        This is problematic, because if our model were to simply predict <i>every</i> test as being negative, it would have an accuracy of <br><br>
        ${katexify(`\\begin{aligned} \\frac{Num Positive}{Total Samples} = \\frac{26}{34} = 76\\% \\end{aligned}`) }<br><br>
        In other words, we can better by simply predicting ALL tests as negative - no modeling required!
        </p>
      `,
      `<h1>Precision</h1>
      <p>Precision is the ratio of correctly predicted positive classes to <i>all items predicted to be positive:</i><br><br>
      ${katexify(`\\begin{aligned} \\frac{TP}{TP + FP } = \\frac{${$TP} }{${$TP + $FP}} \\approx ${Math.round(precision * 100)}\\% \\end{aligned}`) } <br><br>
      Intuitively, this tells us how correct, or <i>precise</i>, are our model's positive predictions. 
      Such a metric is important when the identification of False Positives is needed. </p>`,
      `<h1>Recall</h1>
      <p>Recall is the ratio of correctly predicted positive classes to <i>all items that are actually positive:</i><br><br>
      ${katexify(`\\begin{aligned} \\frac{TP}{TP + FN } = \\frac{${$TP} }{${$TP + $FN}} \\approx ${Math.round(recall * 100)}\\%  \\end{aligned}`) } <br><br>
      It measures how many of the actual positive instances we were able to correctly predict (or '<i>recall</i>'). 
      Recall is important when the identification of False Positives is needed.</p>`,
      `<h1>Tradeoff</h1>
      <p>Ideally, our model would have perfect precision <i>and</i> recall. However, in practice there often exists a tradeoff between the two.
        To see for yourself, try moving the decision boundrary from left to right:<br> <br>
        <span class='bold'>Precision:</span> ${Math.round(precision * 100)}% 
        <br><br>
        <span class='bold'>Recall:</span> ${Math.round(recall * 100)}% 
        <br><br>
        This tradeoff is very important to factor in when designing a classification model.</p>`,
  ];


  const target2event = {
  0: () => {
    // move decision bonudary to middle position
    // console.log(select("rect.decision-boundary-bar"))
    // console.log('0' )
    $stage = 'none';


  },
  1: () => {
    // $TP += 1;
    // selectAll('circle').attr('r', 40)
    $stage = 'none';

  },

  2: () => {
	// $FP += 3;
  $stage = 'precision';

  },
  3: () => {
    $stage = 'recall';

	// $TN += 3;
  },
  4: () => {
	// $TN += 5;
  $stage = 'none';

  },
  5: () => {
	// $FP += 4;
  $stage = 'none';

  }
};

// trigger events on scroll typeof lastname !== "undefined"
// $: if (value) target2event[value]()
$: if (typeof value !== "undefined") target2event[value]()



</script>

<section>

  <!-- scroll container -->
  <div class="section-container">
    <div class="steps-container">
      <Scrolly bind:value>
        {#each steps as text, i}
          <div class="step" class:active={value === i}>
            <div class="step-content">{@html text}
          </div>
          </div>
        {/each}
        <div class="spacer" />
      </Scrolly>
    </div>
    <div class='charts-container'>
      <!-- <Scatterplot step={value} /> -->
      <div class='chart-container'>
        <LayerCake
          padding={{bottom: 15}}
          x={xKey}
          y=50
          z={zKey}
          zScale={scaleOrdinal()}
          zDomain={Array.from(seriesNames)}
          zRange={seriesColors}
          data={dataTransformed}
          let:width
        >
      
          <Svg>
            <AxisX/>
            <AxisY/>
            <Beeswarm
              r={width < 400 ? r / 1.15 : r}
              strokeWidth={2}
              xStrength={0.95}
              yStrength={0.075}
              getTitle={d => d[titleKey]}
            />
          <DecisionBoundary />
          </Svg>
      
          <Html pointerEvents={false}>
            <Key shape='circle' />
          </Html>
      
        </LayerCake>
      </div>
      <ConfusionMatrix />
    </div>
  </div>
  <!-- end scroll -->
<br><br>
<p class='body-text'>
  Because of this tradeoff, it's important to reflect on the problem that you're trying to solve,
  including the inherent consequences of favoring precision over recall (or vice versa). 
  <br><br>
  Take our cancer example: designing a model with high recall will identify most people that have cancer (<i>true positives</i>), saving their lives, but
  at the cost of misdiagnosing healthy individuals as having cancer (<i>false positives</i>), subjecting them to expensive and dangerous treatments like chemotherapy.
  On the other hand, designing a model for precision yields confident diagnoses (i.e. someone predicted as having cancer very likely does have cancer), but at the cost of 
  failing to identify everyone who has the disease (false negatives), resulting in potentially fatal consequences for those left undiagnosed.
  <br><br>
  For this reason, it's important to understand and decide ahead of time what's more consequential,
   <span class="bold">False Positives</span> or <span class="bold">False Negatives</span>, to investigate how the tradeoff manifests with your particular dataset, 
   and to design your model accordingly.
</p>

</section>

<style>
	:global(body) {
		overflow-x: hidden;
    background-color: #f1f3f3;
	}

  .chart-container {
		width: 95%;
		height: 100%;
	}
	/* space after scroll is finished */
  .spacer {
    height: 40vh;
  }

  .charts-container {
    position: sticky;
    top: 10%;
    display: grid;
    width: 50%;
    grid-template-columns: 100%;
    grid-row-gap: 2rem;
    grid-column-gap: 0rem;
    grid-template-rows: 55% 30%;
    height: 85vh;
    /* border: 2px solid red; */
  }

  .section-container {
    margin-top: 1em;
    text-align: center;
    transition: background 100ms;
    display: flex;
  }

  .step {
    height: 80vh;
    display: flex;
    place-items: center;
    justify-content: center;
  }

  .step-content {
    font-size: 1.1rem;
    background: whitesmoke;
    color: #ccc;
    border-radius: 5px;
    padding: .5rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: background 500ms ease;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, .2);
    text-align: left;
		width: 75%;
		margin: auto;
		max-width: 500px;
    font-family: var(--font-main);
    line-height: 1.5;
  }

	.step.active .step-content {
		background: white;
		color: black;
	}
	
  .steps-container
  {
    height: 100%;
  }

  .steps-container {
    flex: 1 1 40%;
    z-index: 10;
  }
	
/* Comment out the following line to always make it 'text-on-top' */
  @media screen and (max-width: 950px) {
    .section-container {
      flex-direction: column-reverse;
    }

    .steps-container {
      pointer-events: none;
    }

    .charts-container {
      top: 7.5%;
      width: 95%;
			margin: auto;
    }

    .step {
      height: 130vh;
    }

    .step-content {
      width: 95%;
      max-width: 768px;
      font-size: 17px;
      line-height: 1.6;
    }

    .spacer {
      height: 100vh;
    }
  }


  
</style>




