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
    To implement EO during model training, we can constrain the possible set of parameters,
    {@html katexify(`\\theta`)}, that the so-called loss function<sup
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
            \\textrm{subject to} \\quad \\mathbb{P}(\\hat{Y} \\mathrel{\\char\`≠} Y, A= `
    )}<svg height="16" width="16">
        <circle
            cx="8"
            cy="10"
            r="4"
            stroke="var(--group_circles)"
            stroke-width="1"
            fill="var(--group_circles)"
        />
    </svg>
    {@html katexify(
        `) - \\mathbb{P}(\\hat{Y} \\mathrel{\\char\`≠} Y, A= \\:`
    )}<svg height="10" width="10">
        <polygon
            points="5,0 0,10 10,10"
            style="fill:var(--group_triangles);stroke-width:1"
        />
        Sorry, your browser does not support inline SVG.
    </svg>
    {@html katexify(
        `) \\leq \\epsilon \\\\ 
    \\qquad \\qquad   \\,\\;\\;\\;\\; \\mathbb{P}(\\hat{Y} \\mathrel{\\char\`≠} Y, A= `
    )}<svg height="16" width="16">
        <circle
            cx="8"
            cy="10"
            r="4"
            stroke="var(--group_circles)"
            stroke-width="1"
            fill="var(--group_circles)"
        />
    </svg>
    {@html katexify(
        `) - \\mathbb{P}(\\hat{Y} \\mathrel{\\char\`≠} Y, A= \\:`
    )}<svg height="10" width="10">
        <polygon
            points="5,0 0,10 10,10"
            style="fill:var(--group_triangles);stroke-width:1"
        />
        Sorry, your browser does not support inline SVG.
    </svg>
    {@html katexify(`) \\geq - \\epsilon`)}
    <br />
    <br />where {@html katexify(`\\epsilon \\in \\R^{+}`)}. The smaller {@html katexify(
        `\\epsilon`
    )}, the fairer the decision boundary.
    <br />
    <br />
    Notice that compared to the EO equation, the constraint is actually 'relaxed'
    as we only require the parameters to create a solution where the difference between
    FPR and FNR respectively is smaller than {@html katexify(`\\epsilon`)}.
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
