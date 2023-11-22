import React from "react";

// text search input
export function TextSearchFilter({
  column: { filterValue, preFilteredRows, setFilter }
}) {
  return (
    <input
      value={filterValue || ""}
      className="w-full font-normal rounded p-2 my-3 focus:outline-none pink-border text-xs"
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
  // Calculate the options for filtering using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      let value = row.values[id]
      if((typeof value === 'object')){
        value?.map(i => {
          if(i) options.add(i)
        })
      } else {
        options.add(value)
      }         
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
      {options.map((option, i) => {
        if(option) return <option key={i} value={option}>{option}</option>
      })}
    </select>
  );
}
