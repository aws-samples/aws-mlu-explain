<script>
    import { create_bidirectional_transition } from "svelte/internal";
    import katexify from "../katexify";
    import { tooltip } from "../tooltip";
</script>

<p class="body-text">
    <span class="definition-header"
        >Constrained Optimization during Training</span
    >
</p>
<br />
<p class="body-text">
    <!-- A decision making process is said to suffer from disparate mistreatment with
    respect to a given sensitive attribute (e.g., race) if the misclassification
    rates differ for groups of people having different values of that sensitive
    attribute. -->
    To implement EO during model training, we can constrain the possible set of parameters
    that the so-called loss function<sup
        ><span
            class="info-tooltip"
            title="A loss function quantifies how well a model performs for a given choice of parameters theta. 
      The goal of ML is to find the parameters theta, that minimize the loss."
            use:tooltip
            >[&#8505;]
        </span></sup
    >, {@html katexify(`L(\\theta)`)}, can assume. The constraint can be written
    as:
    <br />
    <br />
    {@html katexify(
        `
        \\min \\quad \\qquad \\;\\, L(\\theta) \\\\ 
            \\textrm{subject to} \\quad \\mathbb{P}(\\hat{Y} \\mathrel{\\char\`≠} Y, A=a) - \\mathbb{P}(\\hat{Y} \\mathrel{\\char\`≠} Y, A=b) \\leq \\epsilon \\\\ 
    \\qquad \\qquad   \\,\\;\\;\\;\\; \\mathbb{P}(\\hat{Y} \\mathrel{\\char\`≠} Y, A=a) - \\mathbb{P}(\\hat{Y} \\mathrel{\\char\`≠} Y, A=b) \\geq - \\epsilon
        `
    )}
    <br />
    <br />
    Compared to the EO equation, the constraint is actually 'relaxed' as we only
    require the parameters to create a solution where the difference between FPR
    and FNR respectively is smaller than {@html katexify(`\\epsilon`)} (and not
    exactly equal).
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
