![MLU-Explain Logo & Title](./assets/readme_header.png)

This repository holds the code used for Amazon's [MLU-Explain](https://mlu-explain.github.io/) educational articles on machine learning. MLU-Explain exists to illustrate core machine learning concepts using visual essays in a fun, informative, and accessible manner.

This material exists as supplementary educational material for [Machine Learning University (MLU)](https://aws.amazon.com/machine-learning/mlu/), which provides anybody, anywhere, at any time access to the same machine learning courses used to train Amazon’s own developers on machine learning.

# Articles

Currently, there are **7** articles published:

## Train, Test, And Validation Sets

<img src="./assets/train-test-validation.gif" alt="Train, Test, And Validation Sets Article Image" width="400"/>

**Title**: [Train, Test, and Validation Sets](https://mlu-explain.github.io/train-test-validation/)

**Summary**: Learn why it is best practice to split your data into training, testing, and validation sets, and explore the utility of each with a live machine learning model.

**Code**: [/code/train-test-validation/](/code/train-test-validation)

**Authors**: Jared Wilber, Brent Werness

## Precision & Recall

<img src="./assets/precision-recall.gif" alt="Precision & Recall Article Preview" width="400"/>

**Title**: [Precision & Recall](https://mlu-explain.github.io/precision-recall/)

**Summary**: When it comes to evaluating classification models, accuracy is often a poor metric. This article covers two common alternatives, Precision and Recall, as well as the F1-score and Confusion Matrices.

**Code**: [/code/precision-recall/](/code/precision-recall)

**Authors**: Jared Wilber

## Decision Trees

<img src="./assets/decision-tree.gif" alt="Decision Trees Article Image" width="400"/>

**Title**: [Decision Trees](https://mlu-explain.github.io/decision-tree/)

**Summary**: Explore one of machine learning's most popular supervised algorithms: the Decision Tree. Learn how the tree makes its splits, the concepts of Entropy and Information Gain, and why going too deep is problematic.

**Code**: [/code/decision-tree/](/code/decision-tree)

**Authors**: Jared Wilber, Lucía Santamaría

## Bias Variance Tradeoff

<img src="./assets/mlu-explain_biasvariance.gif" alt="Bias Variance Tradeoff Article Image" width="400"/>

**Title**: [The Bias Variance Tradeoff](https://mlu-explain.github.io/bias-variance/)

**Summary**: Understand the tradeoff between under- and over-fitting models, how it relates to bias and variance, and explore interactive examples related to LASSO and KNN.

**Code**: [/code/bias-variance/](/code/bias-variance)

**Authors**: Jared Wilber, Brent Werness

## Double Descent: A Visual Introduction

<img src="./assets/double-descent1.gif" alt="Double Descent Article Image" width="400"/>

**Title**: [Double Descent](https://mlu-explain.github.io/double-descent/)

**Summary**: Meet the double descent phenomenon in modern machine learning: what it is, how it relates to the bias-variance tradeoff, the importance of the interpolation regime, and a theory of what lies behind.

**Code**: [/code/double-descent/](/code/double-descent)

**Authors**: Jared Wilber, Brent Werness

## Double Descent 2: A Mathematical Explanation

<img src="./assets/double-desent2.gif" alt="Double Descent 2 Article Image" width="400"/>

**Title**: [Double Descent 2](https://mlu-explain.github.io/double-descent2/)

**Summary**: Deepen your understanding of the double descent phenomenon. The article builds on the cubic spline example introduced in Double Descent 1, describing in mathematical detail what is happening.

**Code**: [/code/double-descent2/](/code/double-descent2)

**Authors**: Brent Werness, Jared Wilber

## Running Locally

This article holds code for each articles, as well as the generated builds from the code (e.g. the static assets comprising the articles).

First, clone this repo.

```bash
git clone https://github.com/aws-samples/aws-mlu-explain.git
```

Next, cd into the article of interest and install the required libraries.

```bash
# e.g. bias variance tradeoff article
cd bias-variance
# install libraries
npm install
```

Now, to run the development version:

```bash
npm start
```

To build and view the static assests:

```bash
# build assets
npm run build
# view generated article
cd dist/
# run local server
python3 -m http.server # or just `live-server`
```

## License Summary

This open source articles are made available under the Creative Commons Attribution-ShareAlike 4.0 International License. See [LICENSE](LICENSE) file.

The sample and reference code within this open source book is made available under a modified MIT license. See the [LICENSE-SAMPLECODE](LICENSE-SAMPLECODE) file.
