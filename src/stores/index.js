// define store for chat app base on local memory
import { createStore } from "vuex";
import { nanoid } from "nanoid";
import { storagePlugin } from "../plugins/storage";
const storedState = localStorage.getItem("vuex-state");

const initialState = storedState
  ? JSON.parse(storedState)
  : {
      users: [
        {
          id: "1",
          name: "John Doe",
          email: "john@doe.com",
          avatar: "https://i.pravatar.cc/150?img=1",
          status: "online",
          isOnline: true,
          lastSeen: "2021-08-01T12:00:00Z",
          isTyping: true,
        },
      ],
      messages: [
        {
          id: "1",
          userId: "1",
          body: "Hello",
          createdAt: "2021-08-01T12:00:00Z",
        },
        {
          id: "2",
          userId: "1",
          body: "How are you?",
          createdAt: "2021-08-01T12:01:00Z",
        },
        {
          id: "3",
          userId: "2",
          body: "Hi, I am fine, thanks",
          createdAt: "2021-08-01T12:02:00Z",
        },
      ],
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
      const user = state.users.find((user) => user.id === message.userId);
      if (!user.isOnline) {
        commit("updateUser", { ...user, isOnline: true });
      }
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
