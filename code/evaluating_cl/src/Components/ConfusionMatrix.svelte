<script></script>

<br><br>
<table>
  <tr>
    <th></th>
    <th class='table-head'>Predicted: 1</th>
    <th class='table-head'>Predicted: 0</th>
  </tr>
  <tr>
    <td class='table-head'>Actual: 1</td>
    <td>True Positive (<span class='bold'>TP</span>)</td>
    <td>False Negative (<span class='bold'>FN</span>)</td>
  </tr>
  <tr>
    <td class='table-head'>Actual: 0</td>
    <td>False Poisitive (<span class='bold'>FP</span>)</td>
    <td>True Negative (<span class='bold'>TN</span>)</td>
  </tr>
</table>
<br><br><br>
<p class='body-text'>
    The confusion matrix is a simple tool for visualizing the performance of some classification model.
    Namely, it decomposes our predictions into several categories of interest:
</p>
<br>
<ul class='body-text'>
    <li><span class='bold'>True Positives (TP)</span>: The number of instances that were positive (+) and correctly classified as positive (+v). 
        You predicted a mail is a spam and it actually is.</li>
    <li><span class='bold'>False Positives (FP)</span>: The number of instances that were positive (+) and incorrectly classified as negative (-). It is also known as Type 2 Error.
        You predicted a mail is not spam and it actually is.</li>
    <li><span class='bold'>True Negatives (TN)</span>: he number of instances that were negative (-) and correctly classified as (-).
        You predicted a mail is not spam and it actually is not.</li>
    <li><span class='bold'>False Negatives (FN)</span>: The number of instances that were negative (-) and incorrectly classified as (+). This also known as Type 1 Error.
        You predicted a mail is not spam and it actually is.</li>
</ul>
<br>
<p class='body-text'>
    The distinction between these four different prediction outcomes is very important, and informs the type of model we'll pick, application 
    at hand. Moreover, we'll soon see that a tradeoff between some of these terms exists, meaning we'll have to take these into consideration during many steps of our modeling process.
</p>
<br>
<p class='body-text'>
    To dig a little deeper, let's imagine a scenario where you're a snake hunter looking to classify rocks by.
</p>



<style>
    h2 {
        margin: auto;
        width: 50%;
        padding-top: 1rem;
        padding-bottom: 2rem;
        max-width: 45rem;
        color: var(--squid-ink)
    }
    
    ul {
        max-width: 45rem;
        margin: auto;
        font-family: var(--font-main);
        font-size: 21px;
        padding-top: .5rem;
    }
    li {
        padding: .25rem;
        list-style: none;
    }
    table {
      border-collapse: collapse;
      width: 40%;
      margin: auto;
      max-width: 45rem;
      font-size: 21px;
      font-family: var(--font-main);
    }
    
    td, th {
      border: 3px solid #dddddd;
      text-align: left;
      padding: 8px;
      color: var(--squid-ink)
    }
    
    tr:nth-child(even) {
      /* background-color: #dddddd; */
    }
    
    th:nth-child(1) {
      border: 0;
    }
    
    .table-head {
        font-family: var(--font-heavy);
        color: var(--squid-ink);
        border: none;
    }
    </style>