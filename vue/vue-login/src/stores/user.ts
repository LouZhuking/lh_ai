import {
  defineStore
} from 'pinia'



export const useUserStore = defineStore('user', {
  state: () => ({
    isLogin: false,
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || '',
  }),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    setUsername(username: string) {
      this.username = username;
      localStorage.setItem('username', username);
    },
    logout() {
      this.token = '';
      this.username = '';
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  },
  // 计算属性 依赖于响应式的状态计算后的结果
  // useMemo react当中使用这个进行缓存
  getters: {
    isLogin(): boolean {
      // !! 的作用是把任意值强制转换成对应的布尔值
      return !!this.token
    }
  }
})