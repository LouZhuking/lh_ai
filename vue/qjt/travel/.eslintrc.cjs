module.exports = {
  root: true,
  extends: ['plugin:vue/vue3-recommended'],
  rules: {
    // Vue 3 允许多根节点；关闭 Vue 2 遗留规则
    'vue/no-multiple-template-root': 'off',
  },
};