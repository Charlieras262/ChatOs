const Chat = require('../models/Chat');

const users = {}

module.exports = (io) => {
    io.on('connection', async socket => {
        
        io.sockets.emit('usernames', Object.keys(users));

        socket.on('init', () => io.sockets.emit('usernames', Object.keys(users)))
        
        socket.on('newUser', (data, callback) => {
            if (data in users) {
                callback(false);
            } else {
                socket.nickname = data;
                users[socket.nickname] = socket;
                io.sockets.emit('usernames', Object.keys(users));
                callback(true);
            }
        })

        socket.on('sendMessage', async (chat) => {
            var newMsg = new Chat(chat);
            await newMsg.save();
            io.sockets.emit('newMessage', newMsg);
        })

        socket.on('logout', (username) => {
            delete users[username]
        })
    });
}