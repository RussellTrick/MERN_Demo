import React from "react";
import { useTable, useGlobalFilter, useRowSelect } from "react-table";
import TableCSS from "./Basictable.module.css";
import { GlobalFilter } from "./GlobalFilter";

const Basictable = (props) => {
  const columns = props.COLUMNS;
  const data = props.DATA;

  const tableInstance = useTable(
    {
      columns: columns,
      data: data,
    },
    useGlobalFilter,
    useRowSelect
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = tableInstance;

  const { globalFilter } = state;

  return (
    <>
      {props.FILTER ? (
        <GlobalFilter
          filter={globalFilter}
          setFilter={setGlobalFilter}
          placeholder={props.PLACEHOLDER}
        />
      ) : null}{" "}
      <div className={TableCSS.container}>
        <table {...getTableProps()}>
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

          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  onContextMenu={
                    props.onContextMenu ? () => props.onContextMenu(row) : null
                  }
                  onClick={props.onClick ? () => props.onClick(row) : null}
                >
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

export default Basictable;
