<script>
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
    A decision making process is said to suffer from disparate mistreatment with
    respect to a given sensitive attribute (e.g., race) if the misclassification
    rates differ for groups of people having different values of that sensitive
    attribute.
    <!-- <br /> Misclassification rates can be measured as fractions over the class
    distribution in the ground truth labels - this can be done during model
    training. -->
    <br />
    Generally, when the fraction of users with positive class labels differ between
    members of different sensitive attribute value groups, it is impossible to construct
    classifiers that are equally well calibrated and also satisfy the equal false
    positive and false negative rate criterion. Therefor, it makes sense to say EO
    is achieved at a certain threshold.
    <br />
    To implement this during model training, a constraint is added when trying to
    find the best possible set of parameters {@html katexify(`\\theta`)} when minimizing
    the Loss function, {@html katexify(`L(\\theta)`)}:
<br />
<br />
    {@html katexify(
        `
        \\min \\; L(\\theta) \\\\
        \\text{s.t. \\;} 
        P(\\hat{Y} \\mathrel{\\char\`≠} Y, A=a) - P(\\hat{Y} \\mathrel{\\char\`≠} Y, A=b) \\leq \\epsilon \\\\
        P(\\hat{Y} \\mathrel{\\char\`≠} Y, A=a) - P(\\hat{Y} \\mathrel{\\char\`≠} Y, A=b) \\geq - \\epsilon
        `
    )}
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

    .gd-math {
    margin: auto;
    max-width: 700px;
    border: 5px solid var(--smile);
    padding: 2rem;
    background-color: var(--paper);
  }

</style>
