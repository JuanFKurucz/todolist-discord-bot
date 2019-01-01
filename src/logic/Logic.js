"use strict";

/**
Logic Class, this is where the fun begins.

Every message from Discord is setn to read function, where it creates the player of the user that sent the message if it doesn't exist
and handles the message with commandHandler.
**/

const User = require(__dirname+"/User.js"),
      { dbQuery } = require("../DataBase.js"),
      CommandConstructor = require(__dirname+"/constructors/CommandConstructor.js"),
      {config} = require("../Configuration.js"),
      Language = require("../Language.js");

module.exports = class Logic {
  constructor(prefix) {
    this.users = {};
    this.guilds = {};
    this.commandConstructor = new CommandConstructor(prefix);
    this.commands = this.commandConstructor.initCommands();
    this.lanCommands = Language.getCommands();

    this.listeningMessages = [];
  }

  onReaction(message){
    const filter = (reaction, user) => {
      return Object.values(config("logic","reactions")).includes(reaction.emoji.id);
    };
    message.awaitReactions(filter)
    .then(async (collected) => {
        const reaction = collected.first(),
              idReaction = reaction._emoji.id;
        console.info(reaction._emoji);
        /*let action = Object.keys(this.reactions2).find((key) => this.reactions2[key] === idReaction);
        switch(action){
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
            var index = parseInt(action)-1;
            if(index>0 && index<this.lastList.length){
              this.lastList[index].acquire(this.owner);
            }
            break;
          case "previousPage":
            break;
          case "nextPage":
            break;
          case "increment":
            break;
          case "decrement":
            break;
        }*/
    })
    .catch((collected) => {
        console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
    });
  }

  async init(client){
    const pendingTasks = await dbQuery("SELECT id_message, id_channel, id_server FROM activity WHERE completed = 0");
    if(pendingTasks !== null){
      const pendingTasksLength = pendingTasks.length;
      for(let pt=0; pt<pendingTasksLength; pt++){
        const currentTask = pendingTasks[pt],
              currentServer = await client.guilds.get(currentTask.id_server),
              currentChannel = await currentServer.channels.get(currentTask.id_channel),
              currentMessage = await currentChannel.fetchMessage(currentTask.id_message);

        this.listeningMessages.push(currentMessage);
        this.onReaction(currentMessage)
      }
    }
  }

  getCommands(){
    return this.commands;
  }

  getCommand(command,user){
    const lan = user.getLanguage();
    let realCommand="command_error";
    if(this.lanCommands.hasOwnProperty(lan) === true){
      if(this.lanCommands[lan].hasOwnProperty(command)===true){
        realCommand=this.lanCommands[lan][command];
      } else if(this.commands.hasOwnProperty("command_"+command)===true){
        return this.commands["command_"+command];
      }
    }
    return this.commands[realCommand];
  }

  async getUser(msg){
    const info = msg.author;
    if(this.users.hasOwnProperty(info.id) === false){
      this.users[info.id] = new User(info.id);
      await dbQuery("INSERT IGNORE INTO user SET ?",{
        "id_user":info.id
      });
    }

    if(this.guilds.hasOwnProperty(msg.guild.id) === false){
      this.guilds[msg.guild.id] = true;
      await dbQuery("INSERT IGNORE INTO guild SET ?",{
        "id_guild":msg.guild.id
      });
    }      

    this.users[info.id].setInfo(info);
    return this.users[info.id];
  }

  onMessage(user){
    user.resetResponses();
  }

};
