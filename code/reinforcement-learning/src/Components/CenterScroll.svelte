<script>
  import Scroll from "./Scrolly.svelte";

  let currentStep;
  const steps = ["<p>Step 0!</p>", "<p>Step 1?</p>", "<p>Step 2.</p>"];
</script>

<section>
  <Scroll bind:value={currentStep}>
    {#each steps as text, i}
      <div class="step" class:active={currentStep === i}>
        <div class="step-content">
          {@html `rer ${text}`}
        </div>
      </div>
    {/each}
  </Scroll>
</section>

<style>
  .step {
    height: 90vh;
    display: flex;
    place-items: center;
    justify-content: center;
  }

  .step-content {
    background: var(--bg);
    color: #ccc;
    padding: 0.5rem 1rem;
    transition: background 500ms ease, color 500ms ease;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
  }

  .step.active .step-content {
    background: white;
    color: black;
  }
</style>
