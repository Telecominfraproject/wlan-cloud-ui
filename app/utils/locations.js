import { filter, isEmpty, each } from 'lodash';

export const NETWORK_NODE = {
  title: 'Network',
  id: '0',
  key: '0',
  value: '0',
  name: 'Network',
};

export const formatLocations = (list = [], disableRoot = false) => {
  function unflatten(array, p) {
    let tree = [];
    const parent = typeof p !== 'undefined' ? p : { id: '0' };
    let children = filter(array, child => child.parentId === parent.id);
    children = children.map(c => ({
      title: c.name,
      value: `${c.id}`,
      key: c.id,
      isLeaf: false,
      ...c,
    }));
    if (!isEmpty(children)) {
      if (parent.id === '0') {
        tree = children;
      } else {
        parent.children = children;
      }
      each(children, child => unflatten(array, child));
    }
    return tree;
  }

  return [
    {
      ...NETWORK_NODE,
      ...(disableRoot && { disabled: true }),
      children: unflatten(list),
    },
  ];
};

export const getBreadcrumbPath = (id, locations) => {
  const locationsPath = [];
  const treeRecurse = (parentNodeId, node) => {
    if (node.id === parentNodeId) {
      locationsPath.unshift(node);
      return node;
    }
    if (node.children) {
      let parent;
      node.children.some(i => {
        parent = treeRecurse(parentNodeId, i);
        return parent;
      });
      if (parent) {
        locationsPath.unshift(node);
      }
      return parent;
    }
    return null;
  };

  treeRecurse(id, {
    id: 0,
    children: locations,
  });

  return locationsPath;
};

export const getLocationPath = (selectedId, locations) => {
  const locationsPath = [];

  const treeRecurse = (parentNodeId, node) => {
    if (node.id === parentNodeId) {
      locationsPath.unshift(node.id);

      if (node.children) {
        const flatten = children => {
          children.forEach(i => {
            locationsPath.unshift(i.id);
            if (i.children) {
              flatten(i.children);
            }
          });
        };

        flatten(node.children);
      }
      return node;
    }
    if (node.children) {
      let parent;
      node.children.some(i => {
        parent = treeRecurse(parentNodeId, i);
        return parent;
      });
      return parent;
    }

    return null;
  };

  if (selectedId) {
    treeRecurse(selectedId, { id: 0, children: locations });
  }

  return locationsPath;
};
