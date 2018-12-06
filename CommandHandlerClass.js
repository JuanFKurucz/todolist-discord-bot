'use strict';

/**
Game Class, this is where the fun begins.

Every message from Discord is setn to read function, where it creates the player of the user that sent the message if it doesn't exist
and handles the message with commandHandler.
**/

const User = require(__dirname+"/UserClass.js");
const dbquery = require(__dirname+"/DataBaseClass.js");

module.exports = class Game {
  constructor(database) {
    this.db = database;
    this.functionPrefix = "execute_";
    this.users={};
  }

  getUser(info,callback){
    var memoryUser=this.users[info.id];
    if(!memoryUser){
      memoryUser = new User(info.id);
      this.users[info.id]=memoryUser;
    }
    memoryUser.update();
  }

  claimMessage(user){
    user.addCookie();
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
      if(activity.description==="") {
        activity.setDescription(command[1]);
      } else {
        activity.addTask(command[1]);
      }
      callback("<@!"+user.id+"> write ."+command[0]+" following the description of a task to complete. Write .end to stop creating the activity and .cancel to stop and delete the activity.");
    }
  }

  execute_end(user,command,callback){
    var activity = user.getActivity();
    if(activity===null){
      callback("<@!"+user.id+"> you are not creating an activity");
    } else {
      activity.save(function(response){
        callback("<@!"+user.id+"> "+response);
      });
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
