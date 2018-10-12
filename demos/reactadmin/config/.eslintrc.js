module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'node': true
  },
  'extends': 'airbnb',
  'globals': {},
  'parser': 'babel-eslint',
  'plugins': [
    'import',
    'jsx-a11y',
    'react'
  ],
  'rules': {
    /* ESLint 检查规则 */
    /* @see https://eslint.org/docs/rules/ */
    // Possible Errors
    'no-console': 'off', // 禁用 console
    // Best Practices
    'eqeqeq': [2, 'allow-null'], // 要求使用 === 和 !==
    'no-param-reassign': 'off', // 禁止对 function 的参数进行重新赋值
    // Variables
    'no-shadow-restricted-names': 'warn', // 禁止将标识符定义为受限的名字
    // Stylistic Issues
    'comma-dangle': ['error', 'never'], // 要求或禁止末尾逗号
    'indent': ['error', 2], // 强制使用一致的缩进，缩进空格为 2
    'max-len': ['warn', 120, { 'ignoreUrls': true }], // 强制一行的最大长度，最大长度为 120
    'no-underscore-dangle': 'off', // 禁止标识符中有悬空下划线
    // Node.js and CommonJS
    'global-require': 'off', // 要求 require() 出现在顶层模块作用域中
    // ES6(ES2015)
    'arrow-body-style': 'off', // 要求箭头函数体使用大括号
    'arrow-parens': 'off', // 要求箭头函数的参数使用圆括号
    'no-restricted-syntax': 'off',

    /* React 语法的 ESLint 检查规则 */
    /* @see https://github.com/yannickcr/eslint-plugin-react */
    'react/no-multi-comp': 'off', // 防止每个文件有多个组件定义
    'react/prop-types': 'off', // 防止在 React 组件中没有对 props 的校验
    'react/forbid-prop-types': 'off',
    'react/prefer-stateless-function': 'off', // 强制无状态 React 组件为纯函数
    'react/jsx-filename-extension': 'off',  // 限制可能包含 JSX 的文件扩展名
    'react/no-array-index-key': 'off',   // 限制数组索引作为 key
    'react/no-string-refs': 'off',
    'react/jsx-no-target-blank': 'off',

    /* JSX 元素的 ESLint 检查规则 */
    /* @see https://github.com/evcohen/eslint-plugin-jsx-a11y */
    'jsx-a11y/href-no-hash': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off', // 不应该为非交互式元素分配鼠标或键盘事件监听器
    'jsx-a11y/label-has-for': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',

    /* 导入规则的 ESLint 检查规则 */
    /* @see https://github.com/benmosher/eslint-plugin-import */
    'import/no-dynamic-require': 'off', // 禁止 require() 调用表达式
    'import/no-extraneous-dependencies': 'off', // 禁止使用无关的 package
    'import/no-unresolved': [2, { commonjs: true, amd: true }] // 导入的模块可以解析为本地文件系统上的模块
  }
};
