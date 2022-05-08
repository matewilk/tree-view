import React, { useState } from "react";
import { TextField, Button } from "nr1";

import { data } from "./data";

import "./components/FontawesomeIcons"

import { TreeView } from "./components/TreeView";
import { buildTree } from "./build-tree";

const style = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "10px",
};

// remove white spaces from string
const removeWhiteSpaces = (string) => string.replace(/\s+/g, "");

// check  whether to traverse the tree based on sort state input (change to field validation)
const shouldTraverse = (array) => array.length <= 1 && array[0] === "";

export const App = () => {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");
  const [tree, setTree] = useState(data);

  const applySort = () => {
    const sortOrderArr = removeWhiteSpaces(sort).split(",");
    const tree = !shouldTraverse(sortOrderArr)
      ? buildTree(data, sortOrderArr)
      : data;

    setTree([ ...tree ]);
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
      <TreeView data={tree} filter={filter} />
    </div>
  );
};
