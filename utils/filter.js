import React from "react";

// text search input
export function TextSearchFilter({
  column: { filterValue, preFilteredRows, setFilter }
}) {
  return (
    <input
      value={filterValue || ""}
      className="w-full font-normal rounded p-2 my-3 focus:outline-none pink-border"
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search...`}
    />
  );
}

// a dropdown list filter
export function DropdownFilter({
  column: { filterValue, setFilter, preFilteredRows, id }
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
    className="w-full font-normal rounded p-2 my-3 focus:outline-none pink-border"
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
