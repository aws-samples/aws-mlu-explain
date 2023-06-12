import {
  numLayersInteractive,
  networkInteractive,
  showText,
  networkInteractiveWeights,
} from "../../store";

import { numNeurons } from "../../utils";

export function instantiateWeights() {
  const numWeights = numNeurons($networkInteractive);

  const weightVals = Array.from({ length: numWeights }, (_, index) => {
    // Get the number of input neurons for the current weight
    const inputNeurons =
      $networkInteractive[index % ($networkInteractive.length - 1)];
    // Apply He Initialization
    const heInit = Math.sqrt(2 / inputNeurons) * (Math.random() * 2 - 1);

    return { data: heInit, grad: 0 };
  });

  $networkInteractiveWeights = [...weightVals];
}
