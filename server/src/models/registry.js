const {Channel} = require('./channel');

class Registry {
    constructor() {
        this.channels = new Map();
    }

    handleClose(client) {
        this.channels.forEach((channel, id) => {
            channel.leave(client);
            if (channel.clients.size === 0) {
                this.channels.delete(id);
            }
        });
    }

    handleMessage(client, message) {
        console.log("Handling message", message);

        const data = JSON.parse(message);
        const {channelId} = data;

        if (!this.channels.has(channelId)) {
            this.channels.set(channelId, new Channel());
        }

        const channel = this.channels.get(channelId);
        channel.join(client);
        channel.broadcast(client, data);
    }
}

module.exports = {
    Registry,
};
