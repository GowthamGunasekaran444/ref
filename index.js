const transformData = (data) => {
  const rows = [];

  // GENDER
  if (data.SEX?.Overall) {
    Object.entries(data.SEX.Overall).forEach(([key, value]) => {
      rows.push({
        category: "GENDER",
        label: key === "F" ? "FEMALE" : key,
        value: value
      });
    });
  }

  // AGE
  if (data.AGE?.Overall) {
    Object.entries(data.AGE.Overall).forEach(([key, value]) => {
      rows.push({
        category: "AGE (YRS.)",
        label: key.toUpperCase(),
        value: value
      });
    });
  }

  // ETHNICITY
  if (data.ETHNIC?.Overall) {
    Object.entries(data.ETHNIC.Overall).forEach(([key, value]) => {
      rows.push({
        category: "ETHNICITY",
        label: key,
        value: value
      });
    });
  }

  return rows;
};




const columnDefs = [
  {
    field: "category",
    rowGroup: true,
    hide: true
  },
  {
    field: "label",
    headerName: ""
  },
  {
    field: "value",
    headerName: "OVERALL"
  }
];





import { AgGridReact } from "ag-grid-react";

const TableComponent = ({ data }) => {
  const rowData = transformData(data);

  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        groupDisplayType="groupRows"
        animateRows={true}
      />
    </div>
  );
};


