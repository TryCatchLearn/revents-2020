export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf('.') -1 >>> 0) + 2);
}

export function createDataTree(dataset) {
  let hashtable = Object.create(null);
  dataset.forEach(a => hashtable[a.id] = {...a, childNodes: []});
  let dataTree = [];
  dataset.forEach(a => {
    if (a.parentId) hashtable[a.parentId].childNodes.push(hashtable[a.id]);
    else dataTree.push(hashtable[a.id]);
  });
  return dataTree;
}