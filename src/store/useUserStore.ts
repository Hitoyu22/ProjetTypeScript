import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '', 
    username: '',
  }),
  actions: {
    initialize() {
      this.token = localStorage.getItem('token') || '';  
    },
    setUser(token: string, username: string) {
      this.token = token;
      this.username = username;
      localStorage.setItem('token', token);
    },
    logout() {
      this.token = '';
      this.username = '';
      localStorage.removeItem('token');
    },
  },
});
