import { defineStore } from 'pinia';

export const UserContext = defineStore('userState', {
  state: () => ({
    user: null,
    userData: null, 
    userIdCarrito:null
  }),
  actions: {
    logIn(userData) {
      this.user = true;
      this.userData = userData; 
    },
    logOut() {
      this.user = null;
      this.userData = null; 
    },
  },
});
