import React, { useState, useEffect } from "react";
import { TextField, Button } from "nr1";
import Tree, { useTreeState, treeHandlers } from "react-hyper-tree";
import { has, uniqBy, map, filter } from "lodash";

import { data } from "./data";

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

const filterFn = (filter: string) => (node: any) => {
  return node.data.name.includes(filter);
};

export const App = () => {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [tree, setTree] = useState();

  let required2, handlers2
  const applySort = () => {
    const sortOrderArray = removeWhiteSpaces(sort).split(",");
    const tree = rebuildTree(data, sortOrderArray);
    setTree(tree)
    ({ required2, handlers2 } = useTreeState({
      data,
      id: "your_tree_id2",
      defaultOpened: true,
      filter: filterFn(filter),
    }));
  };

  const { required, handlers } = useTreeState({
    data,
    id: "your_tree_id",
    defaultOpened: true,
    filter: filterFn(filter),
  });

  const renderNode = ({ node }) => {
    return <div>{node.data.name}</div>;
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
      <Tree {...required} {...handlers} renderNode={renderNode} />
      {required2 && handlers2 ? <Tree {...required2} {...handlers2} renderNode={renderNode} /> : ""}
    </div>
  );
};
