function TestPlugin(accessors){
    let state;
    let lastMessage = false;

    /* Allow for the /test/.* endpoints to be handled */
    this.registerWebHandlers = (WebServerHandlerRegistration) => {
        WebServerHandlerRegistration(new RegExp("\/test\/.*"), () => {
            return new Promise((resolve, reject) =>{
                resolve({
                    "status":200,
                    "content-type":"application/json",
                    "content":JSON.stringify({"test":"test"})
                })
            })
        });
    }

    /* Allow this application to store state */
    this.connectToStore = (store) => {
        state = store;
    }

    /* handle twich commands */
    this.registerTwitchCommandHandler = (TwitchCommanderHandlerRegistration) => {
        TwitchCommanderHandlerRegistration("echo", "Returns what you say to this bot", (command, isMod, argv, respond) => {
            return new Promise((res, rej) => {
                try{
                    respond(`your said '${argv.join(" ")}'`);
                    res();
                }catch(ex){
                    rej("Unknown error occured");
                }
            });
        });
        TwitchCommanderHandlerRegistration("lastmsg", "Says the last message again.", (command, isMod, argv, respond) => {
            return new Promise((res, rej) => {
                    respond(`${lastMessage}`);
                    res();
            });
        });
    }

    /* handle automated messaging to twitch */
    this.registerTwitchChatTrigger = (writer) => {
        setInterval(() => {
            writer("Why not try the echo system using !echo");
        }, 1000)
    }

    /* handle reading all messages */
    this.registerTwitchMessageHandler = (message) => {
        lastMessage = message;
    }

    this.init = () => {
        console.log("TestPlugin Loaded");
    }
}

module.exports = TestPlugin;