import React from "react";
import Tree, { useTreeState, IUseTreeState } from "react-hyper-tree";

const filterFn = (filter: string) => (node: any) => {
  return node.data.name.includes(filter);
};

export const TreeView = ({ tree, filter }: { tree: IUseTreeState, filter: string}) => {
  const { required, handlers } = useTreeState({
    data: tree,
    id: "tree",
    defaultOpened: true,
    filter: filterFn(filter),
  });

  return (<Tree {...required} {...handlers}/>)
};
