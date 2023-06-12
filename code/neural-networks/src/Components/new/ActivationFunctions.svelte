<script>
  import Table from "./Table.svelte";
  import katexify from "../../katexify";
  import { tooltip } from "../../tooltip";
</script>

<section>
  <br />
  <p class="body-text">
    As you can see, neural networks are not so complicated! They are just
    computational graphs, channeling inputs through successive layers of
    computation to generate outputs. This process of inference, whereby inputs
    are fed through the network to produce output predictions, is called the <span
      class="bold">forward pass</span
    >. Let's talk more about those layers of computation, the activation
    functions.
    <br /><br />
  </p>
  <h1 class="body-header">Activation Functions</h1>
  <hr />
  <p class="body-text">
    Activation functions are at the heart of artificial neurons in a neural
    network. These crucial components introduce non-linearity into the model,
    transforming the weighted inputs to generate an output. <span class="bold"
      >Simply put, an activation function decides how much signal to pass onto
      the next layer based on the input it receives.</span
    >
    This idea of chaining many weighted signals together is what allows neural networks
    to learn very complex relationships.
    <sup
      ><span
        class="info-tooltip"
        title="In fact, the Universal Approximation Theorem essentially says that a properly structured and configured neural network is theoretically capable of modeling any complex relationship, but practically, it can be challenging to find the right parameters to achieve this."
        use:tooltip
        >[&#8505;]
      </span></sup
    >
    <br /><br />
    The non-linear nature of these functions is essential for neural networks to
    learn from complex data. If we only used linear activation functions, no matter
    how many layers we stacked, the network would behave just like a single-layer
    perceptron because the composition of linear functions is still a linear function.
    This limits the complexity of tasks the network can learn. Non-linear activation
    functions, on the other hand, enable the network to learn complex patterns and
    solve intricate problems by adding layers of abstraction.
    <br /><br />
    There's a diverse range of activation functions utilized in neural networks,
    each with its unique benefits and applications. Here are four popular activation
    functions:
    <br /><br />
  </p>
  <Table />
  <br /><br />
  <p class="body-text">
    <span class="bold">The sigmoid</span> (or logistic) function, which ranges
    from 0 to 1, is particularly useful in the output layer of binary
    classification models, representing the probability of a binary event.
    However, it can suffer from the vanishing gradients problem during
    backpropagation.
    <br /><br />
    <span class="bold">The hyperbolic tangent</span> (or 'tanh') function, which
    ranges from -1 to 1, provides a zero-centered output designed to make
    learning for the next layer easier. Yet, like sigmoid, it also faces the
    vanishing gradients issue. <br /><br />
    <span class="bold">The Rectified Linear Unit</span> (or 'ReLU') function is
    a popular choice in hidden layers due to its efficiency. It activates a node
    if its input is positive, otherwise, it outputs zero. This simplicity
    reduces computational cost and mitigates the vanishing gradients problem,
    but it can lead to dead neurons where some neurons never activate.
    <br /><br />
    Despite their simplicity, chaining these functions together in a neural network
    can have magical results. That said, it's crucial to remember that there's no
    one-size-fits-all solution when it comes to choosing activation functions. The
    best choice often depends on the specific characteristics of the problem at hand,
    the nature of the input and output data, and the architecture of the network.
    Thus, understanding these functions and their implications is key to building
    effective and efficient neural networks.
  </p>
  <br /><br />
  <br /><br />
</section>

<style>
  section {
    max-width: 80%;
    margin: auto;
  }

  @media screen and (max-width: 950px) {
    section {
      max-width: 98%;
    }
  }
</style>
