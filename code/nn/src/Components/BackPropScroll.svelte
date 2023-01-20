<script>
  import NetworkChart from "./NetworkChart.svelte";
  import Logo from "./Logo.svelte";
  import { onMount } from "svelte";
  import { select } from "d3-selection";

  const stepTitles = [
    " ",
    "1. Modeling Linear Equations",
    "2. Modeling Nonlinearities",
    "3. More Complex Nonlinearities",
    "4. Neural Networks",
  ];
  $: stepIndex = 0;

  const target2event = {
    0: () => {
      select("#network-chart").style("background-color", "teal");
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
      select("#network-chart").style("background-color", "teal");

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
<section>
  <div class="scrolly-container">
    <div class="charts-container">
      <!-- <h2 class="chart-title">{stepTitles[stepIndex]}</h2> -->
      <div class="chart-holder">
        <NetworkChart />
      </div>
    </div>
    <div id="steps-container">
      <div class="step" data-index="0">
        <div class="step-content">
          <!-- <h2>Content inside</h2> -->
          <p>
            Despite their complexity, neural networks are quite simple. To see
            for ourselves, we'll build one up from scratch, starting with a
            computational view of linear regression.
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
    </div>
  </div>
</section>

<style>
  section {
    padding-bottom: 5rem;
    background-color: var(--darksquidink);
    color: var(--white);
  }
  h1 {
    font-family: var(--font-mono);
    font-size: 5rem;
    text-transform: uppercase;
  }
  p {
    color: var(--white);
  }
  .chart-title {
    text-align: left;
    font-size: 1.5rem;
  }

  .scrolly-container {
    text-align: center;
    display: flex;
    margin-top: 0;
    padding-top: 0;
    flex-direction: row-reverse;
    padding-left: 1rem;
  }

  .charts-container {
    position: sticky;
    top: 5%;
    width: 90%;
    height: 70vh;
    margin-right: 2%;
    border: 2px solid green;
    flex: 0 0 60%; /* This item will take up 70% of the container's width */
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
    height: 100vh;
    display: flex;
    place-items: center;
    justify-content: flex-start;
    padding: 1rem;
    padding-right: 1.4rem;
    background-color: var(--darksquidink);
    color: var(--white);
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
