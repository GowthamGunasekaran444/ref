import React from "react";
import ReactECharts from "echarts-for-react";

export default function PlantRiskSankey() {
  const data = [
    { month: "February 25", score: 20, risk: "LOW", color: "#00B050" },
    { month: "March 25", score: 30, risk: "LOW", color: "#00B050" },
    { month: "April 25", score: 78, risk: "MED", color: "#F28E2B" },
    { month: "May 25", score: 65, risk: "MED", color: "#F28E2B" },
    { month: "June 25", score: 72, risk: "MED", color: "#F28E2B" },
    { month: "July 25", score: 91, risk: "HIGH", color: "#D70000" },
  ];

  // Create links with delta calculation and color based on target
  const links = data.slice(0, -1).map((d, i) => {
    const delta = data[i + 1].score - d.score;
    return {
      source: d.month,
      target: data[i + 1].month,
      value: Math.abs(delta),
      delta: delta,
      color: data[i + 1].color, // color follows target
    };
  });

  const option = {
    title: {
      text: "Plant Risk Score Journey - Supplier",
      left: "center",
      top: 10,
      textStyle: { fontSize: 16, fontWeight: "bold" },
    },
    tooltip: {
      trigger: "item",
      backgroundColor: "#fff",
      borderColor: "#ccc",
      borderWidth: 1,
      textStyle: { color: "#000" },
      formatter: (params) => {
        if (params.dataType === "node") {
          const node = data.find((d) => d.month === params.name);
          return `
            <b>${node.month}</b><br/>
            Risk: ${node.risk}<br/>
            Score: ${node.score}
          `;
        } else if (params.dataType === "edge") {
          const link = links.find(
            (l) => l.source === params.data.source && l.target === params.data.target
          );
          return `
            <b>${link.source} → ${link.target}</b><br/>
            Change: ${link.delta > 0 ? "+" : ""}${link.delta}
          `;
        }
        return "";
      },
    },
    series: [
      {
        type: "sankey",
        layout: "none",
        left: "5%",
        right: "5%",
        top: 80,
        bottom: 60,
        emphasis: { focus: "adjacency" },
        nodeWidth: 60,
        nodeGap: 25,
        draggable: false,

        // Nodes (Months)
        data: data.map((d) => ({
          name: d.month,
          value: d.score,
          itemStyle: { color: d.color, borderRadius: 8 },
          label: {
            show: true,
            formatter: `${d.risk}\n${d.score}`,
            color: "#fff",
            fontWeight: "bold",
            fontSize: 13,
          },
        })),

        // Links (Connectors)
        links: links.map((l) => ({
          source: l.source,
          target: l.target,
          value: l.value,
          lineStyle: {
            color: l.color,
            opacity: 0.5,
            curveness: 0.5,
          },
          label: {
            show: true,
            formatter: `${l.delta > 0 ? "+" : ""}${l.delta}`,
            color: "#000",
            fontWeight: "bold",
            fontSize: 12,
          },
        })),
      },
    ],

    // Month labels as "axis" below
    graphic: data.map((d, i) => ({
      type: "text",
      left: `${(i / (data.length - 1)) * 90 + 5}%`,
      bottom: 18,
      style: {
        text: d.month,
        textAlign: "center",
        fill: "#222",
        fontSize: 13,
        fontWeight: "bold", // make labels bolder
      },
    })),
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 950,
        margin: "0 auto",
        background: "#fff",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <ReactECharts option={option} style={{ height: "470px", width: "100%" }} />
    </div>
  );
}
