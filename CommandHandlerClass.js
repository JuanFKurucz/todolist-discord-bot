'use strict';

/**
Game Class, this is where the fun begins.

Every message from Discord is setn to read function, where it creates the player of the user that sent the message if it doesn't exist
and handles the message with commandHandler.
**/

const dump_channel = "519704135319289856";
const User = require(__dirname+"/UserClass.js");
const Await = require(__dirname+"/AwaitClass.js");
const { dbQuery } = require(__dirname+"/DataBaseClass.js");

const Message = require('discord.js').RichEmbed;


var BotSelf;

module.exports = class CommandHandler {
  constructor(client) {
    this.functionPrefix = "execute_";
    this.users={};
    this.client=client;
    this.awaits={};
    BotSelf = this;
  }

  awaitMessageReactions(){
    var self = this;
    var channel = this.client.channels.find("name","to-do-list");
    /*db.query("SELECT id_activity, id_message FROM activity WHERE completed IS NULL",function(error, results, fields){
      if(error){
        console.log(error);
      } else {
        for(var r in results){
          var a = new Await(results[r].id_activity,results[r].id_message);
          self.awaits[a.id_message] = a;
          channel.fetchMessage(a.id_message)
          .then(message => {
            message.awaitReactions(function(reaction,user){
              console.log(reaction);
              console.log(user);
            });
          })
          .catch(console.error);
        }
        console.log(results);
      }
    });*/
  }

  async getUser(info){
    var memoryUser=this.users[info.id];
    if(!memoryUser){
      memoryUser = new User(info.id);
      this.users[info.id]=memoryUser;
    }
    return await memoryUser.update();
  }


  async execute_info(user,command){
    var m = new Message();
    let results = await dbQuery("SELECT * FROM user WHERE id_user = "+user.id);
    console.log(results);
    if (!results) {
      m.setDescription("Unexpected error")
    } else {
      if(results.length>0){
        m.setDescription("<@!"+results[0].id_user+"> you have permission level "+results[0].permission);
      } else {
        m.setDescription("User not found");
      }
    }
    return m;
  }

  async execute_add(user,command){
    var m = new Message();
    m.setTitle("Add activity");
    var activity = user.getActivity();
    if(activity===null){
      user.createActivity(this.client);
      m.setDescription("<@!"+user.id+"> welcome to the activity creator, here is the list of commands")
    } else {
      m.setDescription("<@!"+user.id+"> you are already creating an activity, here is the list of commands");
      /*
      var c = command[0];
      command.shift();
      var desc = command.join(" ");
      if(activity.description==="") {
        activity.setDescription(desc);
      } else {
        activity.addTask(desc);
      }
      m.setDescription("<@!"+user.id+"> write ."+c+" following the description of a task to complete. Write .end to stop creating the activity and .cancel to stop and delete the activity.");
      */
    }
    m.addField("Set the title","Use '.title Name' to set the activity title");
    m.addField("Set a task title","Use '.taskT Number Title' to add a task");
    m.addField("Set a task description","Use '.taskD Number Description' to add a task description");
    //m.addField("Add a task requirement","Use '.task Title' to add a task");
    //m.addBlankField();
    m.addBlankField();
    m.addField("Remove a task","Use '.rtask Number' or '.rtask Description' to remove a task");
    //m.addBlankField();
    m.addField("Cancel creating the activity","Use '.cancel' to delete the current activity and stop creating it");
    m.addField("Save the activity and exit","Use '.end' to save the activity and exit the creation");
    return m;
  }

  async execute_end(user,command){
    var m = new Message();
    m.setTitle("End activity");
    var activity = user.getActivity();
    if(activity===null){
      m.setDescription("<@!"+user.id+"> you are not creating an activity");
    } else {
      this.client.channels.find("name","to-do-list").send(activity.print())
      .then(async function(message){
        var o={
          "id_message":message.id,
          "id_channel":message.channel.id,
          "id_server":message.guild.id
        }
        var response = await activity.save(o);
        user.cancelActivity();
        m.setDescription("<@!"+user.id+"> "+response);
      }).catch(console.error);
    }
    return m;
  }

  async execute_cancel(user,command){
    var m = new Message();
    m.setTitle("Cancel activity");
    var activity = user.getActivity();
    if(activity===null){
      m.setDescription("<@!"+user.id+"> you are not creating an activity");
    } else {
      user.cancelActivity();
      m.setDescription("<@!"+user.id+"> activity was cancelled successfully");
    }
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
