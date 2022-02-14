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
    }
    input {
        width: 150px;
    }
</style>