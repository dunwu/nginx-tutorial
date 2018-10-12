import _ from 'lodash';

const getItemByUrl = (list, url, items) => {
  list.forEach((item) => {
    if (item.url === url) {
      items.push(item);
    }
    if (_.isArray(item.children)) {
      getItemByUrl(item.children, url, items);
    }
  });
};
const getItemByKey = (list, key, items) => {
  list.forEach((item) => {
    if (item.key === key) {
      items.push(item);
    }
    if (_.isArray(item.children)) {
      getItemByKey(item.children, key, items);
    }
  });
};
function getPaths(list, key, paths, keyPath) {
  const tmp = [];
  getItemByKey(list, key, tmp);
  if (_.isEmpty(tmp)) {
    return paths;
  }
  paths.push(tmp[0]);
  keyPath.push(tmp[0].key);
  return getPaths(list, tmp[0].parent, paths, keyPath);
}
function getPathsAndKeyPath(router, menu, paths, keyPath) {
  // 根据选中菜单项的关键 key 数组获取对应组件
  const items = [];
  if (router.location.pathname && menu.list) {
    getItemByUrl(menu.list, router.location.pathname, items);

    if (!_.isEmpty(items)) {
      paths.push(items[0]);
      keyPath.push(items[0].key);
      getPaths(menu.list, items[0].parent, paths, keyPath);
    }
    paths = _.reverse(paths);
    keyPath = _.reverse(keyPath);
  }
}

export default getPathsAndKeyPath;
