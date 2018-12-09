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
    this.ch = new CommandHandler(this);
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

  isCommand(text){
    return text.indexOf(this.prefix)===0;
  }

  parseCommand(text){
    var command=text.substring(this.prefix.length,text.length).toLowerCase();
    return command.split(" ");
  }

  async commandHandler(msg){
    let response = null;
    let text = msg.content+"";
    let user = await this.ch.getUser(msg.author);
    if(this.isCommand(text)){
      var command = this.parseCommand(text);
      let call = this.ch.functionPrefix+command[0];

      if(typeof this.ch[call] === 'function'){
        response = await this.ch[call](user,command);
        if(response !== null && response !== "delete"){
          response.setFooter(this.client.user.username);
          response.setTimestamp(new Date());
          this.sendMessage(msg.channel,response);
        } else if(response === "delete"){
          msg.delete();
        }
      } else {
        this.sendMessage(msg.channel,"Unknown command");
      }
    }
  }

  async sendMessage(channel,message){
    let msg;
    try {
      msg = await channel.send(message);
    } catch(e) {
      msg = null;
    }
    return msg;
  }

  onMessage(msg){
    if(msg.hasOwnProperty("author") && !msg.author.bot){
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
