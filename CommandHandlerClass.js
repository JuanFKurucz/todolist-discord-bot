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
    dbquery("SELECT * FROM user WHERE id_user = "+user.id,function(error, results, fields){
      if (error) callback("Unexpected error");
      if(results.length>0){
        callback("<@!"+results[0].id_user+"> you have permission level "+results[0].permission);
      } else {
        callback("User not found");
      }
    });
  }

  execute_add(user,command,callback){
    var activity = user.getActivity();
    if(activity===null){
      user.createActivity();
      callback("<@!"+user.id+"> write ."+command[0]+" following the title of the activity");
    } else {
      var c = command[0];
      command.shift();
      var desc = command.join(" ");
      if(activity.description==="") {
        activity.setDescription(desc);
      } else {
        activity.addTask(desc);
      }
      callback("<@!"+user.id+"> write ."+c+" following the description of a task to complete. Write .end to stop creating the activity and .cancel to stop and delete the activity.");
    }
  }

  execute_end(user,command,callback){
    var activity = user.getActivity();
    if(activity===null){
      callback("<@!"+user.id+"> you are not creating an activity");
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
          callback("<@!"+user.id+"> "+response);
        });
      }).catch(console.error);
    }
  }

  execute_cancel(user,command,callback){
    var activity = user.getActivity();
    if(activity===null){
      callback("<@!"+user.id+"> you are not creating an activity");
    } else {
      user.cancelActivity();
      callback("<@!"+user.id+"> activity was cancelled successfully");
    }
  }
}
