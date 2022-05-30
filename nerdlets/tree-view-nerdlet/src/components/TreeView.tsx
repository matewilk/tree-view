import React from "react";
import Tree from "./Tree";

import { filterTree } from "../lib/build-tree";

export const TreeView = ({ data, filter }: { data: any; filter: string }) => {
  const tree = filterTree(data, filter);

  return <Tree data={tree} filter={filter} />;
};
