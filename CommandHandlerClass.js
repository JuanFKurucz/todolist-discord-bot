'use strict';

/**
Game Class, this is where the fun begins.

Every message from Discord is setn to read function, where it creates the player of the user that sent the message if it doesn't exist
and handles the message with commandHandler.
**/

const User = require(__dirname+"/UserClass.js");
const Guild = require(__dirname+"/GuildClass.js");
const Await = require(__dirname+"/AwaitClass.js");
const { dbQuery } = require(__dirname+"/DataBaseClass.js");
const Message = require('discord.js').RichEmbed;

module.exports = class CommandHandler {
  constructor(bot) {
    this.channelToDo="general";
    this.functionPrefix = "execute_";
    this.users={};
    this.guilds={};

    this.bot=bot;
    this.client=bot.client;
    this.awaits={};

    this.loadAwaits();
  }

  async loadAwaits(){
    let results = await dbQuery("SELECT id_activity, id_message FROM activity WHERE completed IS NULL");
    for(var r in results){
      var a = new Await(results[r].id_activity,results[r].id_message);
      this.awaits[a.id_message] = a;
      console.log(a.id_message);
    }
  }

  awaitMessageReactions(messageReaction,user,added){
    if(this.awaits.hasOwnProperty(messageReaction.message.id)){
      console.log(messageReaction._emoji.name);
    }
  }

  async getGuild(guildId){
    let memoryGuild=this.users[guildId];
    if(!memoryGuild){
      memoryGuild = new Guild(guildId);
      this.guilds[guildId]=memoryGuild;
    }
    return await memoryGuild.update();
  }

  async getUser(msg){
    let userGuild = await this.getGuild(msg.guild.id);
    let userId = msg.author.id;
    let memoryUser=this.users[userId];
    if(!memoryUser){
      memoryUser = new User(userId);
      this.users[userId]=memoryUser;
    }
    memoryUser.addGuild(userGuild);
    memoryUser.setLastMessage(msg);
    return await memoryUser.update();
  }


  async execute_info(user,command){
    var m = new Message();
    let results = await dbQuery("SELECT role.* FROM user_guild_role LEFT JOIN role ON user_guild_role.id_role = role.id_role WHERE id_user = '"+user.id+"' AND id_guild='"+user.getLastMessage().guild.id+"'");
    let description="User doesn't have any special permissions";
    if (!results) {
      description="Unexpected error";
    } else if(results.length>0){
      description=user.getMention()+" you are a/an "+results[0].name+" that means you have a permission level "+results[0].permission;
    }
    m.setDescription(description);
    return m;
  }

  async execute_add(user,command){
    var m = new Message();
    var activity = user.getActivity();
    let description="<@!"+user.id+"> you are already creating an activity, here is the list of commands";
    if(activity===null){
      user.createActivity(this.client);
      description="<@!"+user.id+"> welcome to the activity creator, here is the list of commands";
    }

    m.setTitle("Add activity");
    m.setDescription(description);
    m.addField("Set the title","Use '.title Name' to set the activity title");
    m.addField("Set a task title","Use '.taskT Number Title' to add a task");
    m.addField("Set a task description","Use '.taskD Number Description' to add a task description");
    m.addField("Remove a task","Use '.rtask Number' or '.rtask Description' to remove a task");
    m.addField("Cancel creating the activity","Use '.cancel' to delete the current activity and stop creating it");
    m.addField("Save the activity and exit","Use '.end' to save the activity and exit the creation");

    return m;
  }

  async execute_end(user,command){
    var m = new Message();
    m.setTitle("End activity");
    var activity = user.getActivity();
    let description = "<@!"+user.id+"> you are not creating an activity";
    if(activity!==null){
      var o={
        "id_message":activity.messageId,
        "id_channel":activity.channelId,
        "id_server":activity.guildId
      }
      var response = await activity.save(o);
      user.cancelActivity();
      description = "<@!"+user.id+"> "+response;
    }
    m.setDescription(description);
    return m;
  }

  async execute_cancel(user,command){
    var m = new Message();
    m.setTitle("Cancel activity");
    var activity = user.getActivity();
    let description = "<@!"+user.id+"> you are not creating an activity";
    if(activity!==null){
      user.cancelActivity();
      description = "<@!"+user.id+"> activity was cancelled successfully";
    }
    m.setDescription(description);
    return m;
  }


    /**
        Activity Creation
    **/
  getRestOfCommand(command,startPoint=1){
    var c=command;
    for(var i=0;i<startPoint;i++){
      c.shift();
    }
    return c.join(" ");
  }

  async execute_title(user,command){
    var activity = user.getActivity();
    if(activity!==null){
      activity.setTitle(this.getRestOfCommand(command));
    }
    return "delete";
  }

  async execute_desc(user,command){
    var activity = user.getActivity();
    if(activity!==null){
      activity.setDescription(this.getRestOfCommand(command));
    }
    return "delete";
  }

  async execute_taskt(user,command){
    var activity = user.getActivity();
    if(activity!==null){
      if(command.length>=3 && !isNaN(command[1])){
        activity.setTaskTitle(this.getRestOfCommand(command,2),parseInt(command[1]));
      } else {
        activity.setTaskTitle(this.getRestOfCommand(command,1));
      }
    }
    return "delete";
  }

  async execute_taskd(user,command){
    var activity = user.getActivity();
    if(activity!==null){
      if(command.length>=3 && !isNaN(command[1])){
        activity.setTaskDescription(this.getRestOfCommand(command,2),parseInt(command[1]));
      } else {
        activity.setTaskDescription(this.getRestOfCommand(command,1));
      }
    }
    return "delete";
  }
}
