<template>
  <header>
    <h1>Web Chat</h1>
    <span class="current-user"> Current ID: {{ userId }} </span>
  </header>
  <main>
    <section v-if="messageCount === 0">
      <div class="empty">
        <div>
          <a href="https://vuejs.org/" target="_blank">
            <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
          </a>
        </div>
        <p>No message yet</p>
      </div>
    </section>
    <section ref="messageSection" class="container">
      <div v-for="(message, i) in last25Messages" :key="i">
        <div class="message" :class="isMe(message.userId) ? 'my-message' : ''">
          <author>{{ isMe(message.userId) ? "Me" : message.userId }}</author>
          <p class="body">
            {{ message.body }}
          </p>
          <time>{{ message.createdAt }}</time>
        </div>
      </div>
    </section>
  </main>
  <footer class="footer">
    <div class="send">
      <input
        type="text"
        placeholder="Your message"
        v-model="message"
        @keyup.enter="send()"
      />
      <button @click="send()" :disabled="!message">Send</button>
    </div>
  </footer>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "App",
  data() {
    return {
      message: "",
      userId: "",
    };
  },
  created() {
    this.getUserId();
  },
  mounted() {
    this.scrollToBottom();
  },
  computed: {
    messages() {
      return this.$store.state.messages ?? [];
    },
    messageCount() {
      return this.$store.state.messages.length ?? 0;
    },
    last25Messages() {
      const startIndex = Math.max(0, this.messageCount - 25);
      return this.messages.slice(startIndex);
    },
  },
  methods: {
    ...mapActions(["sendMessage"]),
    async send() {
      if (!this.message) return;
      await this.sendMessage({ body: this.message, userId: this.userId });
      this.message = "";
    },
    generateUserId() {
      return Math.random().toString(36).substring(2, 15);
    },
    getUserId() {
      if (!window.name) {
        window.name = this.generateUserId();
      }
      this.userId = window.name;
    },
    isMe(userId) {
      return this.userId === userId;
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const messageSection = this.$refs.messageSection;
        if (messageSection) {
          messageSection.scrollTop = messageSection.scrollHeight;
        }
      });
    },
  },
};
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.message {
  box-sizing: border-box;
  text-align: left;
  padding: 0.5rem 1rem;
  margin: 1rem;
  background: #ffffff;
  color: #333333;
  border-radius: 1.125rem 1.125rem 1.125rem 0;
  min-height: 2.25rem;
  width: -webkit-fit-content;
  width: -moz-fit-content;
  width: fit-content;
  max-width: 66%;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.075),
    0rem 1rem 1rem -1rem rgba(0, 0, 0, 0.1);
}
.message .body {
  margin: 0;
}
.my-message {
  text-align: right;
  margin: 1rem 1rem 1rem auto;
  border-radius: 1.125rem 1.125rem 0 1.125rem;
  background: #41b883;
  color: #333333;
}

.footer {
  position: fixed;
  bottom: 0;
  margin: 0;
  padding: 0;
  width: 100%;
}
.footer .send {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.footer .send input {
  width: 100%;
  padding: 0.5em 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5em;
  font-size: 1rem;
}
.empty {
  text-align: center;
  margin: 1rem;
  color: #8e8e8e;
  margin-top: 50px;
}

.current-user {
  text-align: center;
  margin-top: -90px;
  color: #8e8e8e;
  text-transform: uppercase;
}

author {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.5);
  margin: 0;
  text-transform: uppercase;
}

time {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.5);
}

.container {
  padding-bottom: 70px;
}
</style>
