/**
 * 删除代码中导入的css
 */
module.exports = function () {
  console.log('no-require-css 执行');
  return {
    name: "no-require-css",
    visitor: {
      ImportDeclaration(path, state) {
        let importFile = path.node.source.value;
        if (importFile.indexOf(".scss") > -1 || importFile.indexOf(".css") > -1) {
          // 如果引入了 css文件，则删除此节点
          path.remove();
        }
      }
    }
  }
}