(function () {

  var socket = io();
  // Input user name Component
  Vue.component('input-name', {
    props: ['isLogged'],
    data: function () {
      return {
        userName: ''
      }
    },
    template: `<div id="nameInput" v-show="!isLogged">
                        <div class="field is-grouped">
                            <div class="control">
                                <input v-model="userName" v-on:keydown.enter="sendUserName" class="input is-primary" placeholder="Your name">
                            </div>
                            <div class="control">
                                <button v-on:click="sendUserName" :disabled="!userName" class="button is-primary">Enter</button>
                            </div>
                        </div>
                    </div>`,
    methods: {
      sendUserName: function () {
        if (this.userName.length > 0) {
          this.$emit('set-name', this.userName);
        }
      }
    }
  });

  // Users component
  Vue.component('users', {
    props: ['users'],
    template: ` <div>
                    <h4 class="title is-4">Current users ({{users.length}})</h4>
                    <ul>
                        <li v-for="user in users">
                            <div class="media-content">
                                <div class="content">
                                    <p>
                                        <strong>{{user.name}}</strong>
                                    </p>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>`
  });

  // Vue instance
  var app = new Vue({
    el: '#app',
    data: {
      messages: [],
      users: [],
      userName: '',
      isLogged: false
    },
    methods: {
      sendMessage: function (message) {
        if (message) {
          socket.emit('send-msg', {
            message: message,
            user: this.userName
          });
        }
      },
      setName: function (userName) {
        this.userName = userName;
        this.isLogged = true;
        socket.emit('add-user', this.userName);
      }
    }
  });

  // Client Socket events

  // When the server emits a message, the client updates message list
  socket.on('read-msg', function (message) {
    app.messages.push({
      text: message.text,
      user: message.user,
      date: message.date
    });
  });

  // When user connects, the server emits user-connected event which updates user list
  socket.on('user-connected', function (userId) {
    app.users.push(userId);
  });

  // Init user list. Updates user list when the client init
  socket.on('update-users', function (users) {
    app.users = users;
  });

})();