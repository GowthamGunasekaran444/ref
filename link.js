import { useCallback } from "react";

export function useExcelExporter() {
  const exportToExcel = useCallback(
    async (csvString: string, fileName: string = "export.xlsx"): Promise<void> => {
      try {
        // Lazy-load XLSX only when needed
        const XLSX = await import("xlsx");

        // Create worksheet from CSV
        const worksheet = XLSX.utils.csv_to_sheet(csvString);

        // Create workbook and append sheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Trigger download
        XLSX.writeFile(workbook, fileName);
      } catch (error) {
        console.error("Excel export failed:", error);
      }
    },
    []
  );

  return { exportToExcel };
}
