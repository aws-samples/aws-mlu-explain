<script>
  import NetworkChart from "./NetworkChart.svelte";
  import Logo from "./Logo.svelte";
  import { onMount } from "svelte";
  import { select } from "d3-selection";

  const stepTitles = [
    " &ws;",
    "1. Modeling Linear Equations",
    "2. Modeling Nonlinearities",
    "3. More Complex Nonlinearities",
    "4. Neural Networks",
  ];
  $: stepIndex = 0;

  const target2event = {
    0: () => {
      select("#network-chart").style("background-color", "teal");
      select("#");
      stepIndex = 0;
    },

    1: () => {
      select("#network-chart").style("background-color", "skyblue");
      stepIndex = 1;
      console.log("yeah");
    },
    2: () => {
      console.log("yeah");
      stepIndex = 2;
      select("#network-chart").style("background-color", "coral");
    },
    3: () => {
      stepIndex = 3;

      console.log("yeah");
    },
    4: () => {
      stepIndex = 4;

      console.log("yeah");
    },
    5: () => {
      stepIndex = 5;

      console.log("yeah");
    },
  };

  function fireEvent(entryIndex) {
    if (entryIndex in target2event) {
      target2event[entryIndex]();
    }
  }

  onMount(() => {
    // store elements to track
    // let sections = selectAll(".step").nodes();
    const sections = [...document.querySelectorAll(".step")];
    console.log("sections", sections);

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
</script>

<!-- <h1 class='main-title'>Neural Networks</h1> -->
<div class="scrolly-container">
  <div class="charts-container">
    <h2 class="chart-title">{stepTitles[stepIndex]}</h2>
    <div class="chart-holder">
      <NetworkChart />
    </div>
  </div>
  <div id="steps-container">
    <div class="step" data-index="0">
      <div class="step-content">
        <Logo />
        <h1>Neural <br /> Networks</h1>
        <p>
          By <a href="https://twitter.com/jdwlbr">Jared Wilber</a>, January 2023
        </p>
      </div>
    </div>
    <div class="step" data-index="1">
      <div class="step-content">
        <h2>Content inside</h2>
        <p>blah blah blah</p>
      </div>
    </div>
    <div class="step" data-index="2">
      <div class="step-content">
        <h2>Content inside</h2>
        <p>blah blah blah</p>
      </div>
    </div>
    <div class="step" data-index="3">
      <div class="step-content">
        <h2>Content inside</h2>
        <p>blah blah blah</p>
      </div>
    </div>
  </div>
</div>

<style>
  /* h1.main-title {
    position fixed;
    font-size: 4rem;
    font-family: var(--font-bold);
    margin: 0;
    padding: 0;
  } */
  h1 {
    font-family: var(--font-mono);
    font-size: 5rem;
    text-transform: uppercase;
  }
  .chart-title {
    text-align: left;
    font-size: 1.5rem;
  }

  .scrolly-container {
    margin-top: 1em;
    text-align: center;
    display: flex;
    scroll-snap-type: y mandatory;
    height: 100vh;
    overflow-y: scroll;
    -ms-overflow-style: none; /* Edge, Internet Explorer */
    scrollbar-width: none; /* Firefox */
    overflow-y: scroll;
    scroll-behavior: smooth;
  }

  .charts-container {
    position: sticky;
    top: 10%;
    width: 65%;
    height: 70vh;
    margin-right: 5%;
    border: 2px solid green;
  }

  .chart-holder {
    width: 100%;
    height: 100%;
  }

  .step {
    position: relative;
    scroll-snap-align: center;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    /* border: 2px solid black; */
    /* original */
    height: 90vh;
    display: flex;
    place-items: center;
    justify-content: flex-start;
    /* end */
  }
  .step {
    height: 100vh;
  }

  .step-content {
    text-align: left;
  }

  .step > * {
    opacity: 1;
    transform: translate3d(0, 4rem, 0);
    transition: opacity 800ms var(--delay),
      transform 800ms cubic-bezier(0.13, 0.07, 0.26, 0.99) var(--delay);
  }

  div::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
</style>
