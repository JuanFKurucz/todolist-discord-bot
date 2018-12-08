'use strict';

/**
Game Class, this is where the fun begins.

Every message from Discord is setn to read function, where it creates the player of the user that sent the message if it doesn't exist
and handles the message with commandHandler.
**/

const dump_channel = "519704135319289856";
const User = require(__dirname+"/UserClass.js");
const Await = require(__dirname+"/AwaitClass.js");
const {dbquery,dbupdate} = require(__dirname+"/DataBaseClass.js");

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
    dbquery("SELECT id_activity, id_message FROM activity WHERE completed IS NULL",function(error, results, fields){
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
    });
  }

  getUser(info,callback){
    var memoryUser=this.users[info.id];
    if(!memoryUser){
      memoryUser = new User(info.id);
      this.users[info.id]=memoryUser;
    }
    memoryUser.update(callback);
  }


  execute_info(user,command,callback){
    var m = new Message();
    dbquery("SELECT * FROM user WHERE id_user = "+user.id,function(error, results, fields){
      if (error) {
        m.setDescription("Unexpected error")
      } else {
        if(results.length>0){
          m.setDescription("<@!"+results[0].id_user+"> you have permission level "+results[0].permission);
        } else {
          m.setDescription("User not found");
        }
      }
      callback(m);
    });
  }

  execute_add(user,command,callback){
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
    callback(m);
  }

  execute_end(user,command,callback){
    var m = new Message();
    m.setTitle("End activity");
    var activity = user.getActivity();
    if(activity===null){
      m.setDescription("<@!"+user.id+"> you are not creating an activity");
      callback(m);
    } else {
      this.client.channels.find("name","to-do-list").send(activity.print())
      .then(message => {
        var o={
          "id_message":message.id,
          "id_channel":message.channel.id,
          "id_server":message.guild.id
        }
        activity.save(o,function(response){
          user.cancelActivity();
          m.setDescription("<@!"+user.id+"> "+response);
          callback(m);
        });
      }).catch(console.error);
    }
  }

  execute_cancel(user,command,callback){
    var m = new Message();
    m.setTitle("Cancel activity");
    var activity = user.getActivity();
    if(activity===null){
      m.setDescription("<@!"+user.id+"> you are not creating an activity");
    } else {
      user.cancelActivity();
      m.setDescription("<@!"+user.id+"> activity was cancelled successfully");
    }
    callback(m);
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

  execute_title(user,command,callback){
    var activity = user.getActivity();
    if(activity!==null){
      activity.setTitle(this.getRestOfCommand(command));
    }
    callback("delete");
  }

  execute_desc(user,command,callback){
    var activity = user.getActivity();
    if(activity!==null){
      activity.setDescription(this.getRestOfCommand(command));
    }
    callback("delete");
  }

  execute_taskt(user,command,callback){
    var activity = user.getActivity();
    if(activity!==null){
      if(command.length>=3 && !isNaN(command[1])){
        activity.setTaskTitle(this.getRestOfCommand(command,2),parseInt(command[1]));
      } else {
        activity.setTaskTitle(this.getRestOfCommand(command,1));
      }
    }
    callback("delete");
  }

  execute_taskd(user,command,callback){
    var activity = user.getActivity();
    if(activity!==null){
      if(command.length>=3 && !isNaN(command[1])){
        activity.setTaskDescription(this.getRestOfCommand(command,2),parseInt(command[1]));
      } else {
        activity.setTaskDescription(this.getRestOfCommand(command,1));
      }
    }
    callback("delete");
  }
}
