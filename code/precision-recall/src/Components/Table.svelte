<script>
  import { TP, FP, TN, FN } from "./data-store.js";
</script>

<table>
  <tr>
    <th />
    <th class="table-head">Predicted: Positive</th>
    <th class="table-head">Predicted: Negative</th>
  </tr>
  <tr>
    <td class="table-head">Actual: Positive</td>
    <td>TP: {$TP}</td>
    <td>FN: {$FN}</td>
  </tr>
  <tr>
    <td class="table-head">Actual: Negative</td>
    <td>FP: {$FP}</td>
    <td>TN: {$TN}</td>
  </tr>
</table>

<style>
  table {
    border-collapse: collapse;
    /* max-width: 75%; */
    margin: auto;
    font-size: 21px;
    font-family: var(--font-main);
  }

  td,
  th {
    border: 3px solid #dddddd;
    text-align: left;
    padding: 8px;
    color: var(--squid-ink);
  }

  th:nth-child(1) {
    border: 0;
  }

  .table-head {
    font-family: var(--font-heavy);
    color: var(--squid-ink);
    border: none;
  }

  @media screen and (max-width: 768px) {
    table {
      max-width: 95%;
    }
  }
</style>
