import React from "react";
import Tree from "./Tree";

import { filterTree, addCount } from "../lib/build-tree";

export const TreeView = ({ data, filter }: { data: any; filter: string }) => {
  const tree = filterTree(data, filter);
  if (tree.length > 0) {
    addCount(tree[0]);
  }

  console.log(tree);
  return <Tree data={tree} filter={filter} />;
};
