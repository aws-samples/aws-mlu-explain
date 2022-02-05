<script>
	import { TP, FP, TN, FN } from './data-store.js';

	// track state of scroll step
	export let step = 0;

	function calculateValues() {
		// update values for scroll
		// get position of line
		//  calculate valyes greater than line
		// calculate values less than line
	}

	// dict for target events
// const target2event = {
//   0: () => {
//   },
//   1: () => {
//     $TP += 1;
//   },

//   2: () => {
// 	$FP += 3;
//   },
//   3: () => {
// 	$TN += 3;
//   },
//   4: () => {
// 	$TN += 5;
//   },
//   5: () => {
// 	$FP += 4;
//   }
// };

// // trigger events on scroll
// $: if (step) target2event[step]()
</script>

<table>
	<tr>
	  <th></th>
	  <th class='table-head'>Predicted: Pig</th>
	  <th class='table-head'>Predicted: Cow</th>
	</tr>
	<tr>
	  <td class='table-head'>Actual: Pig</td>
	  <td>TP: {$TP}</td>
	  <td>FN: {$FN}</td>
	</tr>
	<tr>
	  <td class='table-head'>Actual: Cow</td>
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

td, th {
  border: 3px solid #dddddd;
  text-align: left;
  padding: 8px;
  color: var(--squid-ink)
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
