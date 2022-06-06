import { select } from "d3-selection";
import { entries } from "d3-collection";

export class Table {
  constructor(opts) {
    this.tableContainer = opts.tableContainer;
  }

  drawTable() {
    // remove table if exists
    select("#data-table").remove();

    // set col names
    this.columnNames = [
      "dataset",
      "feature",
      "# cat right",
      "# cat wrong",
      "# dog right",
      "# dog wrong",
      "accuracy",
    ];

    // draw base table
    this.table = select(this.tableContainer)
      .append("table")
      .attr("id", "data-table");

    // add header
    this.thead = this.table.append("thead");

    // add columns
    this.thead
      .selectAll("th")
      .data(this.columnNames, (d) => d)
      .join(
        (enter) => enter.append("th").text((d) => d),
        (update) => {},
        (exit) => {}
      );

    this.startData = [];
  }

  updateTable(newRow) {
    const updatedRow = {
      dataset: newRow["dataset"],
      feature: newRow["feature"],
      "# cat right": newRow["cat right"],
      "# cat wrong": newRow["cat wrong"],
      "# dog right": newRow["dog right"],
      "# dog wrong": newRow["dog wrong"],
      accuracy: newRow["accuracy"],
    };

    // update rows
    this.startData.unshift(updatedRow);

    // don't allow duplicates
    this.startData = Array.from(
      new Set(this.startData.map(JSON.stringify))
    ).map(JSON.parse);

    let rows = this.table
      .selectAll("tr")
      .data(this.startData)
      .join((enter) => enter.append("tr"));

    rows
      .selectAll("td")
      .data((row) => entries(row))
      .join(
        (enter) => enter.append("td").text((d) => d.value),
        (update) => update.text((d) => d.value)
      );
  }
}
