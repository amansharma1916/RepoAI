const buildTree = (paths) => {
  const tree = {};

  for (const path of paths) {
    const parts = path.split("/");

    let current = tree;

    for (const part of parts) {
      if (!current[part]) {
        current[part] = {};
      }

      current = current[part];
    }
  }

  return tree;
};

export default buildTree;