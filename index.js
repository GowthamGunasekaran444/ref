const transformData = (data) => {
  const rows = [];

  // -------- GENDER --------
  rows.push({
    type: "section",
    label: "GENDER"
  });

  if (data.SEX?.Overall) {
    Object.entries(data.SEX.Overall).forEach(([key, value]) => {
      rows.push({
        type: "data",
        label: key === "F" ? "FEMALE" : key,
        value: value
      });
    });
  }

  // -------- AGE --------
  rows.push({
    type: "section",
    label: "AGE (YRS.)"
  });

  if (data.AGE?.Overall) {
    Object.entries(data.AGE.Overall).forEach(([key, value]) => {
      rows.push({
        type: "data",
        label: key.toUpperCase(),
        value: value
      });
    });
  }

  // -------- ETHNICITY --------
  rows.push({
    type: "section",
    label: "ETHNICITY"
  });

  if (data.ETHNIC?.Overall) {
    Object.entries(data.ETHNIC.Overall).forEach(([key, value]) => {
      rows.push({
        type: "data",
        label: key,
        value: value
      });
    });
  }

  return rows;
};



const columnDefs = [
  {
    field: "label",
    headerName: "",
    flex: 1,
    cellRenderer: (params) => {
      if (params.data.type === "section") {
        return `<b>${params.value}</b>`;
      }
      return params.value;
    }
  },
  {
    field: "value",
    headerName: "OVERALL",
    width: 120,
    valueGetter: (params) => {
      return params.data.type === "section" ? "" : params.data.value;
    }
  }
];



.section-row {
  font-weight: bold;
  background-color: #f5f5f5;
}


const getRowClass = (params) => {
  if (params.data.type === "section") {
    return "section-row";
  }
  return "";
};


<AgGridReact
  rowData={transformData(data)}
  columnDefs={columnDefs}
  getRowClass={getRowClass}
  headerHeight={40}
  rowHeight={35}
/>
