<script>
    import katexify from "../katexify";
    import { selectAll } from "d3-selection";
    import Scatterplot from "./Scatterplot.svelte";
    import { sqft, lineType, coeff, intercept } from "../store.js";
    import { onMount } from "svelte";

    let scatterClass;

    // let sections;
    const target2event = {
        0: () => {
            scatterClass.hideResidualLines();
            scatterClass.hideAnnotationLines();
            $lineType = "regressionLineFlat";
        },
        1: () => {
            scatterClass.showResidualLines();
            scatterClass.hideAnnotationLines();
            $lineType = "regressionLineFlat";
        },

        2: () => {
            // scatterClass.hideResidualLines();
            // scatterClass.showAnnotationLines();
            $lineType = "regressionLine";
            $coeff = 0.5;
            $intercept = 205.4;
        },
        3: () => {
            $lineType = "regressionLine";
            $coeff = 0.5;
            $intercept = 205.4;
        },
        4: () => {
            $coeff = 25.65;
            $intercept = -51.79;
            $lineType = "regressionLineSqrt";
        },
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
</script>

<h2 class="body-header">How It Works, Briefly</h2>
<p class="body-text">
    To kick off our understanding, we'll give a quick, high-level introduction
    to how linear regression works. We'll scroll through the core concepts at a
    high-level, before delving into more detail later.
</p>
<section>
    <div class="section-container">
        <div class="steps-container">
            <div class="step" data-index="0">
                <div class="step-content">
                    <p>
                        Given some data for housing size (sqft) and cost, we'll
                        see if we can use linear regression to predict the price
                        of a house from its size (in square-feet). We call the
                        value we're trying to predict (price) our response, or
                        dependent variable (denoted as y), and the values we use
                        for that prediction our predictors, or independent
                        variables (in this case, one feature, the square-footage
                        of a house). Plotting the price of our house versus it's
                        square-footage, we begin to see a relationship:
                    </p>
                </div>
            </div>
            <div class="step" data-index="1">
                <div class="step-content">
                    <p>
                        Given some data for housing size (sqft) and cost, we'll
                        see if we can use linear regression to predict the price
                        of a house from its size (in square-feet). We call the
                        value we're trying to predict (price) our response, or
                        dependent variable (denoted as y), and the values we use
                        for that prediction our predictors, or independent
                        variables (in this case, one feature, the square-footage
                        of a house). Plotting the price of our house versus it's
                        square-footage, we begin to see a relationship:
                    </p>
                </div>
            </div>
            <div class="step" data-index="2">
                <div class="step-content">
                    <p>
                        Because we only have one independent variable,
                        house-size, we say our model is a simple linear
                        regression. Most models use more than one feature
                        (multiple linear regression). The goal of either linear
                        regression model is to find a line that best models the
                        linear relationship between our independent and
                        dependent variable (drawn here). Linear here refers to
                        the relationship between the variables - our line can
                        take shapes other than a straight line (more on that
                        later).
                    </p>
                </div>
            </div>
            <div class="step" data-index="3">
                <div class="step-content">
                    <p>
                        Linear regression is a supervised model, meaning it
                        learns to model Y by looking at previous data. It uses
                        this previous data to find a line that minimizes the
                        residuals, or error, in our dataset. The 'best fit' line
                        is one that minimizes these residuals the best
                    </p>
                    <div id="input-container">
                        <p>Value: {$sqft}</p>
                        <input
                            type="range"
                            min="0"
                            max="2000"
                            bind:value={$sqft}
                            class="slider"
                            id="myRange"
                        />
                    </div>
                </div>
            </div>
            <div class="step" data-index="4">
                <div class="step-content">
                    <p>
                        Linear regression is a supervised model, meaning it
                        learns to model Y by looking at previous data. It uses
                        this previous data to find a line that minimizes the
                        residuals, or error, in our dataset. The 'best fit' line
                        is one that minimizes these residuals the best
                    </p>
                    <div id="input-container">
                        <p>Value: {$sqft}</p>
                        <input
                            type="range"
                            min="0"
                            max="2000"
                            bind:value={$sqft}
                            class="slider"
                            id="myRange"
                        />
                    </div>
                </div>
            </div>
            <div class="spacer" />
        </div>
        <div class="charts-container">
            <div class="chart-one">
                <Scatterplot bind:this={scatterClass} />
            </div>
        </div>
    </div>

    <br /><br />

    <p class="body-text">And that's the end of our scrolly.</p>
</section>

<style>
    .chart-one {
        width: 100%;
        height: 100%;
    }
    /* space after scroll is finished */
    .spacer {
        height: 40vh;
    }

    .charts-container {
        position: sticky;
        top: 20%;
        width: 40%;
        height: 40vh;
        margin-right: 5%;
    }

    .section-container {
        margin-top: 1em;
        text-align: center;
        transition: background 100ms;
        display: flex;
    }

    .step {
        height: 110vh;
        display: flex;
        place-items: center;
        justify-content: center;
    }

    .step-content {
        font-size: var(--size-default);
        background: var(--bg);
        color: #ccc;
        border-radius: 1px;
        padding: 0.5rem 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        transition: background 500ms ease;
        text-align: left;
        width: 75%;
        margin: auto;
        max-width: 500px;
        font-family: var(--font-main);
        line-height: 1.3;
        border: 5px solid var(--default);
    }

    .step.active .step-content {
        background: var(--bg);
        color: var(--squidink);
    }

    .steps-container {
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
