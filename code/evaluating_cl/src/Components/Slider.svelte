<script>
    import { format } from "d3-format";
    export let label;
    export let value;

    const formatter = format(".2f")
</script>

<div class='slider-holder'>
    <p>{label}: {formatter($value)}</p>
    <input bind:value={$value} type="range" min="0.0" max="1" maxlength='20' step="0.05">
</div>

<style>
    .slider-holder {
        margin: auto;
        width: 20%;
    }
    p {
        margin: 5px auto;
        font-size: 1rem;
        font-family: var(--font-heavy);
    }
    input {
        width: 100%;
    }
    input[type=range] {
        -webkit-appearance: none;
        background: linear-gradient(0.25turn, #7e93ee, #ff99ff);
        width: 100%;
        height:15px;
        border: 1px solid black;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        background-color: black;
        opacity: 0.85;
        width: 10px;
        height: 20px;
    }

     /* mobile */
  @media screen and (max-width: 768px) {
        .slider-holder {
            width: 80%;
        }
  }

</style>