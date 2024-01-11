// define store for chat app base on local memory
import { createStore } from "vuex";
import { nanoid } from "nanoid";
import { storagePlugin } from "../plugins/storage";
const storedState = localStorage.getItem("vuex-state");

const initialState = storedState
  ? JSON.parse(storedState)
  : {
      users: [],
      messages: [],
      currentUser: null,
    };

export default createStore({
  state: {
    ...initialState,
  },
  getters: {
    userById: (state) => (id) => {
      return state.users.find((user) => user.id === id);
    },
    messagesByUserId: (state) => (userId) => {
      return state.messages.filter((message) => message.userId === userId);
    },
    currentUser: (state) => {
      return state.currentUser;
    },
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    addMessage(state, message) {
      state.messages.push(message);
    },
    addUser(state, user) {
      state.users.push(user);
    },
    updateUser(state, user) {
      const index = state.users.findIndex((u) => u.id === user.id);
      state.users[index] = user;
    },
  },
  actions: {
    sendMessage({ commit, state }, message) {
      const messageWithId = {
        ...message,
        id: nanoid(),
        createdAt: new Date().toISOString(),
      };
      commit("addMessage", messageWithId);
    },
    addUser({ commit }, user) {
      commit("addUser", user);
    },
    updateUser({ commit }, user) {
      commit("updateUser", user);
    },
  },
  modules: {},
  plugins: [storagePlugin],
});
