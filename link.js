option = {
    title: {
      text: "Incident Breakdown",
      left: "center",
      top: 10,
      textStyle: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    tooltip: {
      formatter: (info) => `${info.name}: ${info.value}`,
    },
    series: [
      {
        type: "treemap",
        roam: false,
        nodeClick: false,
        breadcrumb: { show: false },
        label: {
          show: true,
          formatter: "{b}",
          color: "#fff",
          fontSize: 12,
        },
        itemStyle: {
          borderColor: "#fff",
          borderWidth: 1,
        },
        width: "100%",
        height: "400px",
        // ✅ Keep it in one line
        leafDepth: 10,
        // Layout control
        upperLabel: { show: false },
        squareRatio: 10, // forces rectangles to be wider (helps flatten)
        data: [
          { name: "Incident A", value: 40, itemStyle: { color: "#0D47A1" } },
          { name: "Incident B", value: 30, itemStyle: { color: "#1565C0" } },
          { name: "Incident C", value: 20, itemStyle: { color: "#1976D2" } },
          { name: "Incident D", value: 10, itemStyle: { color: "#1E88E5" } },
        ],
      },
    ],
  };



option = {
    tooltip: {
      trigger: "item",
      backgroundColor: "#000", // black tooltip background
      textStyle: {
        color: "#fff", // white text
        fontSize: 13,
        fontWeight: 500,
      },
      borderWidth: 0,
      formatter: (params) => {
        return `<div style="text-align:center;">
                  ${params.name}<br/><b>${params.percent}%</b>
                </div>`;
      },
    },
    legend: {
      orient: "vertical", // vertical legend
      left: "left", // aligned to left
      top: "middle", // vertically centered
      itemWidth: 14,
      itemHeight: 14,
      textStyle: {
        color: "#333",
        fontSize: 12,
      },
      type: "scroll", // enable scroll for large legends
      pageButtonItemGap: 5,
      pageIconColor: "#000",
      pageTextStyle: { color: "#000" },
    },
    series: [
      {
        name: "Root Cause",
        type: "pie",
        radius: ["50%", "75%"], // donut chart
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false, // hide inner label (center hover text)
          position: "center",
        },
        emphasis: {
          label: {
            show: false, // disable hover label in the center
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 15, name: "Chemical Attribution" },
          { value: 12, name: "Transport and Delivery" },
          { value: 10, name: "Environmental Contamination" },
          { value: 8, name: "Batch Error" },
          { value: 6, name: "Delivery Documentation" },
          { value: 5, name: "Process Variation" },
          { value: 5, name: "Temperature Deviation" },
          { value: 4, name: "Operator Error" },
          { value: 4, name: "System Downtime" },
          { value: 3, name: "Vendor Issue" },
          { value: 2, name: "Supply Delay" },
          { value: 2, name: "Material Defect" },
          { value: 2, name: "Calibration Error" },
          { value: 1, name: "Electrical Fault" },
          { value: 1, name: "Documentation Error" },
          { value: 1, name: "Packaging Issue" },
          { value: 1, name: "Testing Delay" },
          { value: 1, name: "Sensor Fault" },
          { value: 1, name: "Unknown Cause" },
        ],
        color: [
          "#003f7f",
          "#0059b3",
          "#0073e6",
          "#3399ff",
          "#66b2ff",
          "#004080",
          "#0066cc",
          "#0080ff",
          "#1a8cff",
          "#4da6ff",
        ],
      },
    ],
  };
