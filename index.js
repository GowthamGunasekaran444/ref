import React from 'react';
import { Resizable } from 'react-resizable';

const ResizableTitle = (props) => {
  const { 
    onResize, 
    width, 
    minWidth = 80, 
    maxWidth = 300, 
    ...restProps 
  } = props;

  // Always render resizable component when onResize is provided
  // This allows resizing even without initial width
  if (!onResize) {
    return <th {...restProps} />;
  }

  // If no width is provided, use minWidth as the starting width
  const effectiveWidth = width || minWidth;

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


import React, { useState, useCallback, useMemo } from 'react';
import { Table } from 'antd';

const ResizableTable = ({ dataSource, columns: originalColumns, ...props }) => {
  // Store column widths in state - initialize with minWidth or default
  const [columnWidths, setColumnWidths] = useState(() => {
    return originalColumns.map(col => ({
      width: col.minWidth || 80, // Start with minWidth
      minWidth: col.minWidth || 80,
      maxWidth: col.maxWidth || 300
    }));
  });

  const handleResize = useCallback((index) => (e, { size }) => {
    setColumnWidths(prev => {
      const newWidths = [...prev];
      newWidths[index] = {
        ...newWidths[index],
        width: size.width
      };
      return newWidths;
    });
  }, []);

  const resizableColumns = useMemo(() => {
    return originalColumns.map((col, index) => {
      const { width, minWidth, maxWidth } = columnWidths[index];
      
      return {
        ...col,
        width, // This ensures the column has a width for Ant Design
        onHeaderCell: () => ({
          minWidth,
          maxWidth,
          width, // Pass current width to resizable component
          onResize: handleResize(index),
        }),
      };
    });
  }, [originalColumns, columnWidths, handleResize]);

  return (
    <Table
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


const App = () => {
  const [data] = useState([
    { key: '1', name: 'John Brown', age: 32, address: 'New York' },
    { key: '2', name: 'Jim Green', age: 42, address: 'London' },
  ]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      minWidth: 100,  // Required for resizable
      maxWidth: 250,  // Required for resizable
      // No width property - it will be managed by the resizable component
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

  return <ResizableTable dataSource={data} columns={columns} />;
};
