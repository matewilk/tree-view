import { uniqBy, map, filter } from "lodash";

// get unique values (from array of objects) by key name (iteratee)
const getUniqueValues = (array, iteratee) =>
  map(uniqBy(array, iteratee), iteratee);

// filter array of objects by value
const filterByValue = (array, key, value) => filter(array, { [key]: value });

// build child object with desired name
const buildChildObject = (name, object) => ({ name, ...object });

// ----- Sort/Build tree -----
const buildNodesRecursive = (root, data, sortOrder, i) => {
  const sortValue = sortOrder[i];
  if (sortValue === undefined) return;

  const uniques = getUniqueValues(data.children, sortValue);
  const children = uniques.map((unique) =>
    buildChildObject(unique, {
      children: filterByValue(data.children, sortValue, unique),
    })
  );

  // root is root or branch of tree
  // children are nodes/leafs
  root.children = children;
  root.children.map((item, index) => {
    return buildNodesRecursive(root.children[index], item, sortOrder, i + 1);
  });
  return root;
};

// ---- Start tree recursion with sort order ----
export const buildTree = (data: any, sortOrder: string) => {
  return [
    buildNodesRecursive({ id: "1", name: "Root" }, data[0], sortOrder, 0),
  ];
};

// ---- Utils -----

// Function to filter tree by node property (default node name)
export const filterTree = (tree: any, filter: string, prop = "name") => {
  const getChildren = (result: any, object: any) => {
    if (object[prop].includes(filter)) {
      result.push(object);
      return result;
    }
    if (Array.isArray(object.children)) {
      const children = object.children.reduce(getChildren, []);
      if (children.length) result.push({ ...object, children });
    }
    return result;
  };

  return tree.reduce(getChildren, []);
};

// Function to add count to nodes/leafs
export const addCount = (node: any) => {
  if (node.children == undefined) return 1;
  node.count = 0;
  node.children.forEach(function (c: any) {
    const r = addCount(c);
    //if (!r) console.log(n);
    node.count += r
  });
  return node.count;
};
