// types.ts (or inline in your component file)
import { ColumnType } from 'antd/es/table';

export interface ResizableColumnProps<T> extends ColumnType<T> {
  minWidth?: number;
  maxWidth?: number;
}

export interface ColumnWidthState {
  width: number;
  minWidth: number;
  maxWidth: number;
}


// ResizableTitle.tsx
import React from 'react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';

interface ResizableTitleProps {
  onResize?: (e: React.SyntheticEvent, data: { size: { width: number; height: number } }) => void;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  [key: string]: any; // for restProps like className, children, etc.
}

const ResizableTitle: React.FC<ResizableTitleProps> = (props) => {
  const { onResize, width, minWidth = 80, maxWidth = 300, ...restProps } = props;

  // Only make it resizable if onResize is provided
  if (!onResize) {
    return <th {...restProps} />;
  }

  // Use provided width, or fall back to minWidth as initial width
  const effectiveWidth = width ?? minWidth;

  return (
    <Resizable
      width={effectiveWidth}
      height={0}
      minConstraints={[minWidth, 0]}
      maxConstraints={[maxWidth, 0]}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => e.stopPropagation()}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};




// ResizableTable.tsx
import React, { useState, useCallback, useMemo } from 'react';
import { Table, TableProps } from 'antd';
import ResizableTitle from './ResizableTitle';
import { ResizableColumnProps, ColumnWidthState } from './types';

interface ResizableTableProps<T> extends Omit<TableProps<T>, 'columns'> {
  columns: ResizableColumnProps<T>[];
  dataSource: T[];
}

const ResizableTable = <T extends Record<string, any>>({
  columns: originalColumns,
  dataSource,
  ...props
}: ResizableTableProps<T>) => {
  // Initialize column widths using minWidth or defaults
  const [columnWidths, setColumnWidths] = useState<ColumnWidthState[]>(
    originalColumns.map((col) => ({
      width: col.minWidth ?? 80,
      minWidth: col.minWidth ?? 80,
      maxWidth: col.maxWidth ?? 300,
    }))
  );

  const handleResize = useCallback(
    (index: number) => (_: React.SyntheticEvent, { size }: { size: { width: number } }) => {
      setColumnWidths((prev) => {
        const newWidths = [...prev];
        newWidths[index] = {
          ...newWidths[index],
          width: size.width,
        };
        return newWidths;
      });
    },
    []
  );

  const resizableColumns = useMemo(() => {
    return originalColumns.map((col, index) => {
      const { width, minWidth, maxWidth } = columnWidths[index];

      return {
        ...col,
        width, // AntD needs a concrete width for layout
        onHeaderCell: () => ({
          minWidth,
          maxWidth,
          width,
          onResize: handleResize(index),
        }),
      };
    });
  }, [originalColumns, columnWidths, handleResize]);

  return (
    <Table<T>
      {...props}
      components={{
        header: {
          cell: ResizableTitle,
        },
      }}
      columns={resizableColumns}
      dataSource={dataSource}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default ResizableTable;




// App.tsx
import React, { useState } from 'react';
import ResizableTable from './ResizableTable';
import { ResizableColumnProps } from './types';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

const App: React.FC = () => {
  const [data] = useState<DataType[]>([
    { key: '1', name: 'John Brown', age: 32, address: 'New York' },
    { key: '2', name: 'Jim Green', age: 42, address: 'London' },
  ]);

  const columns: ResizableColumnProps<DataType>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      minWidth: 100,
      maxWidth: 250,
      // No `width` — managed dynamically
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      minWidth: 80,
      maxWidth: 120,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      minWidth: 150,
      maxWidth: 300,
    },
  ];

  return <ResizableTable<DataType> dataSource={data} columns={columns} />;
};

export default App;




/* styles.css or in a styled component */
.react-resizable {
  position: relative;
  background-clip: padding-box;
}

.react-resizable-handle {
  position: absolute;
  width: 10px;
  height: 100%;
  bottom: 0;
  right: -5px;
  cursor: col-resize;
  z-index: 1;
  background-color: transparent;
  border-left: 2px solid rgba(0, 0, 0, 0.1);
}

.react-resizable-handle:hover {
  border-left-color: rgba(0, 0, 0, 0.3);
}

export default ResizableTitle;


import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: { padding: 20 },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: { flexDirection: "row" },
  tableCol: {
    width: "25%", // since we are showing only 4 columns
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4
  },
  tableCell: { fontSize: 10 },
  footer: { marginTop: 10, fontSize: 9, color: "gray" }
});

// PDF Component
const TablePDF = ({ columns, data }) => {
  // Truncate to only 4 columns
  const truncatedColumns = columns.slice(0, 4);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableRow}>
            {truncatedColumns.map((col, idx) => (
              <View key={idx} style={styles.tableCol}>
                <Text style={[styles.tableCell, { fontWeight: "bold" }]}>{col}</Text>
              </View>
            ))}
          </View>
          {/* Rows */}
          {data.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              {truncatedColumns.map((col, colIndex) => (
                <View key={colIndex} style={styles.tableCol}>
                  <Text style={styles.tableCell}>{row[col]}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Footer note */}
        {columns.length > 4 && (
          <Text style={styles.footer}>
            Table truncated. Download full data as CSV for original columns.
          </Text>
        )}
      </Page>
    </Document>
  );
};

// Usage with PDF download
const ExportButton = ({ columns, data }) => (
  <PDFDownloadLink
    document={<TablePDF columns={columns} data={data} />}
    fileName="table.pdf"
  >
    {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
  </PDFDownloadLink>
);

export default ExportButton;
