const Chat = require('../models/Chat');
const config = require('../configs/database')
const users = {}
const jwt = require('jsonwebtoken');

module.exports = (io) => {
    io.on('connection', async socket => {

        socket.on('init', () => io.sockets.emit('usernames', Object.keys(users)))

        socket.on('newUser', (data, callback) => {
            if (data in users) {
                callback({ success: false });
            } else {
                socket.nickname = data;
                users[socket.nickname] = socket;
                io.sockets.emit('usernames', Object.keys(users));
                const token = jwt.sign({ username: data }, config.secret, {
                    expiresIn: 604800 // 1 week
                });
                callback({ success: true, data: { username: data, token } });
            }
        })

        socket.on('sendMessage', async (res) => {
            if (verifyToken(res.token)) {
                var newMsg = new Chat(res.chat);
                await newMsg.save();
                io.sockets.emit('newMessage', newMsg);
            } else socket.emit('unAutorized', res.chat.nick)
        })

        socket.on('sendPrivateMessage', async res => {
            if (verifyToken(res.token)) {
                const newMsg = new Chat(res.chat);
                await newMsg.save()
                users[res.to].emit('newPrivateMessage', newMsg)
            } else socket.emit('unAutorized', res.chat.nick)
        })

        socket.on('logout', (user) => {
            delete users[user.username]
            io.sockets.emit('usernames', Object.keys(users))
        })
    });
}

function verifyToken(token) {
    return users[jwt.verify(token, config.secret).username] != null
}