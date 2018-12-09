'use strict';

/**
  This is the BotClass, pretty similar to the GameClass (i might merge them or something later)

  This handles discord.js library, basically the connection to the Discord Server as a bot, getting messages and such.
  Nothing much to see here, every message is sent to the GameClass
**/

const Discord = require('discord.js');
const CommandHandler = require(__dirname+"/CommandHandlerClass.js");

module.exports = class Bot {
  constructor(prefix) {
    this.todolistChannel = "519704135319289856";
    this.prefix = prefix;
    this.client = new Discord.Client();
    this.ch = new CommandHandler(this.client);
  }

  start(token){
    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
      this.ch.awaitMessageReactions();
    });

    this.client.on('message', msg => {
      this.onMessage(msg);
    });

    this.client.login(token);

  }

  async commandHandler(msg){
    let response = "";
    let text = msg.content+"";
    var self = this;
    var user = await this.ch.getUser(msg.author);
    if(text.indexOf(self.prefix)===0){
      text=text.substring(self.prefix.length,text.length).toLowerCase();
      var command = text.split(" ");

      let call = self.ch.functionPrefix+command[0];

      if(typeof self.ch[call] === 'function'){
        response = await self.ch[call](user,command);
        if(response !== null && response !== "delete"){
          response.setFooter(self.client.user.username);
          response.setTimestamp(new Date());
          msg.channel.send(response)
          .then(message => console.log(`Sent message: ${message.content}`))
          .catch(console.error);
        } else if(response === "delete"){
          msg.delete();
        }
      } else {
        msg.channel.send("Unknown command")
        .then(message => console.log(`Sent message: ${message.content}`))
        .catch(console.error);
      }
    }
  }

  onMessage(msg){
    if(msg.hasOwnProperty("author") && !msg.author.bot){
      let text = msg.content+"";
      this.commandHandler(msg);
    }
  }

  onReaction(msg,user,added){
    if(msg.channel===this.todolistChannel){
      //let text = msg.content+"";
      //this.commandHandler(msg);
    }
  }
}
