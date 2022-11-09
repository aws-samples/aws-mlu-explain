<script>
  import katexify from "../katexify";
  import { select, selectAll } from "d3-selection";
  import NetworkChart from "./NetworkChart.svelte";
  import { sqft, coeff, intercept } from "../store.js";
  import { onMount } from "svelte";
  import { format } from "d3-format";

  //   to do:
  // link scrolling with stepping, so can click to step or scroll and have text 'scroll' up
  // automatically lock to the next section
  //   on each scroll, fade title & text away and update chart & progress bar

  const formatter = format("$,");

  let scatterClass;

  // let sections;
  const target2event = {
    0: () => {},
    1: () => {},
    2: () => {},
    3: () => {},
    4: () => {},
    5: () => {},
  };

  function fireEvent(entryIndex) {
    if (entryIndex in target2event) {
      target2event[entryIndex]();
    }
  }

  onMount(() => {
    // store elements to track
    let sections = selectAll(".step").nodes();

    // observe elements to track
    sections.forEach((section) => {
      observer.observe(section);
    });
  });

  // options for intersection observer
  const options = {
    threshold: 0.7,
  };

  let observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // check if visible or not
      if (entry.isIntersecting) {
        // resolve stage in graph
        const entryIndex = entry.target.getAttribute("data-index");
        if (entryIndex in target2event) {
          fireEvent(entryIndex);
        }
      }
    });
  }, options);

  // $: if (typeof value !== "undefined") target2event[value]();
  const stepTitles = [
    "1. Modeling Linear Equations",
    "2. Modeling Nonlinearities",
    "3. More Complex Nonlinearities",
    "4. Neural Networks",
  ];

  const stepText = [
    "eraer erae rae rer ea re rea re ar ear ea re ar ae r",
    `et eligendi ex maiores inventore, rem blanditiis fuga soluta nam obcaecati
  doloremque. Praesentium, mollitia enim at voluptate provident odit nam
  consectetur, delectus labore quis nulla dolorem neque numquam quae.`,
    `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ratione minus, sequi
  amet eligendi ex maiores inventore, rem blanditiis fuga soluta nam obcaecati
  doloremque. Praesenti`,
    "4eareareareara a re ar ",
  ];

  $: stepIndex = 0;

  function incrementIndex() {
    stepIndex += 1;
    stepIndex = stepIndex % 4;
  }

  function updateProgressBar(i) {
    // color all
    // if index greqter than color, make white
    selectAll("#bar").style("background-color", "white");
    selectAll("#bar")
      .filter((d, i) => i <= stepIndex)
      .style("background-color", "green");
  }

  function updateStepper() {
    incrementIndex();
    console.log("index", stepIndex);
    updateProgressBar(stepIndex);
  }
</script>

<!-- scroll icon -->
<div id="step-button">
  <button on:click={updateStepper}>Scroll</button>
</div>

<!-- section title -->
<h3 id="step-title">{stepTitles[stepIndex]}</h3>

<!-- progress bar -->
<div id="progress-bar-container">
  <div id="progress-bar">
    {#each [0, 1, 2, 3] as d}
      <div id={`bar`} />
    {/each}
  </div>
</div>

<!-- load bar -->

<!-- chart -->
<div id="chart-container">
  <NetworkChart />
</div>
<!-- section text -->
<div id="section-text">
  <p>{stepText[stepIndex]}</p>
</div>

<style>
  #step-button {
    margin: auto;
    max-width: 1000px;
    text-align: center;
  }

  #step-button button {
    border: 2px solid var(--squidink);
    padding: 10px 16px;
  }
  #step-title {
    font-family: var(--font-heavy);
    margin: auto;
    max-width: 1000px;
    font-size: 2rem;
  }
  #progress-bar-container {
    margin: auto;
    max-width: 1000px;
  }
  #progress-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    max-width: 90px;
  }
  #progress-bar > div {
    border: 2px solid red;
    margin: 1rem;
    min-width: 20px;
    min-height: 10px;
  }
  #chart-container {
    margin: 2rem auto;
    width: 1000px;
    height: 300px;
  }
  #section-text {
    margin: auto;
    text-align: center;
    max-width: 500px;
    padding-top: 5rem;
  }
</style>
