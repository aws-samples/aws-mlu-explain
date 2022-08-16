<script>
    import { Environment, State, Actions } from "../data-store.js"
</script>

<table>
  <tr>
    <th class="table-head">Agent</th>
    <th class="table-head">Environment</th>
    <th class="table-head">State</th>
    <th class="table-head">Actions</th>
    <th class="table-head">Reward</th>
  </tr>
  <tr>
    <td>Robot</td>
    <td>{$Environment}</td>
    <td>{$State}</td>
    <td>{$Actions}</td>
    <td>Number of Bananas</td>
  </tr>
</table>

<style>
  table {
    border-collapse: collapse;
    /* max-width: 100%; */
    margin: auto;
    font-size: 23px;
    font-family: var(--font-main);
    padding: 30px;
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
