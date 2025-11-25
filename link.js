import { useCallback } from "react";

export function useExcelExporter() {
  const exportToExcel = useCallback(async (csvString, fileName = "export.xlsx") => {
    try {
      // Dynamically import XLSX to avoid adding to main build
      const XLSX = await import("xlsx");
      
      // Convert CSV → Worksheet
      const worksheet = XLSX.utils.csv_to_sheet(csvString);

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      // Download Excel file
      XLSX.writeFile(workbook, fileName);
    } catch (err) {
      console.error("Excel export failed:", err);
    }
  }, []);

  return { exportToExcel };
}
