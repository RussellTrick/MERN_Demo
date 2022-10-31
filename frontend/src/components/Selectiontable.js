import React, { useMemo } from "react";
import { useTable, useGlobalFilter, useRowSelect } from "react-table";
import TableCSS from "./Basictable.module.css";
import { Checkbox } from "./Checkbox";
import { GlobalFilter } from "./GlobalFilter";

const Selectiontable = (props) => {
  const columns = useMemo(() => props.COLUMNS, []);
  const data = useMemo(() => props.DATA, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
    selectedFlatRows,
  } = useTable(
    {
      columns: columns,
      data: data,
    },
    useGlobalFilter,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        return [
          {
            id: "selection",
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <Checkbox {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }) => <Checkbox {...row.getToggleRowSelectedProps} />,
          },
          ...columns,
        ];
      });
    }
  );

  const { globalFilter } = state;

  return (
    <>
      {props.FILTER ? (
        <GlobalFilter
          filter={globalFilter}
          setFilter={setGlobalFilter}
          placeholder={props.PLACEHOLDER}
        />
      ) : null}

      <div className={TableCSS.container}>
        <table {...getTableProps()}>
          {props.HEADLESS ? null : (
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}{" "}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          )}

          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Selectiontable;
