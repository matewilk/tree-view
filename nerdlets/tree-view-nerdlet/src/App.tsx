import React, { useState } from "react";
import { TextField, Button } from "nr1";
import { has, uniqBy, map, filter } from "lodash";

import { data } from "./data";

import { TreeView } from "./TreeVIew";

const style = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "10px",
};

// remove white spaces from string
const removeWhiteSpaces = (string) => string.replace(/\s+/g, "");

// get unique values (from array of objects) by key name (iteratee)
const getUniqueValues = (array, iteratee) =>
  map(uniqBy(array, iteratee), iteratee);

// filter array of objects by keyName
const filterByKey = (array, keyName) =>
  array.filter((item) => has(item, keyName));

// filter array of objects by value
const filterByValue = (array, key, value) => filter(array, { [key]: value });

// build child object with desired name
const buildChildObject = (name, object) => ({ name, ...object });

const recursive = (data, sortOrder, i) => {
  const sortValue = sortOrder[i];
  if (sortValue === undefined) return;

  const uniques = getUniqueValues(data.children, sortValue);
  const children = uniques.map((unique) =>
    buildChildObject(unique, {
      children: filterByValue(data.children, sortValue, unique),
    })
  );

  data.children = children;
  data.children.map((item) => {
    return recursive(item, sortOrder, i+1);
  });
  return data;
};

const rebuildTree = (data, sortOrder) => {
  return recursive(data, sortOrder, 0);
};

export const App = () => {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [tree, setTree] = useState(data);

  const applySort = () => {
    const sortOrderArray = removeWhiteSpaces(sort).split(",");
    const tree = rebuildTree(data, sortOrderArray);
    setTree({ ...tree})
  };

  return (
    <div>
      <div style={style}>
        <TextField
          label="Sort tree"
          value={sort}
          onChange={(e: any) => setSort(e.target.value)}
        />
        <Button
          style={{ bottom: 0 }}
          type={Button.TYPE.PRIMARY}
          sizeType={Button.SIZE_TYPE.SMALL}
          onClick={() => applySort()}
        >
          Apply
        </Button>
      </div>
      <TextField
        label="Filter tree nodes"
        type="text"
        value={filter}
        onChange={(e: any) => setFilter(e.target.value)}
      />
      <TreeView tree={tree} filter={filter} />
    </div>
  );
};
