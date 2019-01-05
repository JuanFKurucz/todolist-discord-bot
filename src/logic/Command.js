"use strict";

module.exports = class Command {
  constructor(id,name,description="") {
    this.id=id;
    this.name=name;
    this.description=description;
    this.permission = 0;
    this.channels = [];
  }

  canUseChannel(c){
    const text = c.toLowerCase();
    return this.channels.indexOf(text) !== -1;
  }

  addChannel(c){
    const text = c.toLowerCase();
    if(!this.canUseChannel(text)){
      this.channels.push(text);
    }
  }

  getName(){
    return "command_"+this.name;
  }

  getId(){
    return this.id;
  }

  getDescription(){
    return "command_"+this.name.toLowerCase()+"_description";
  }

  execute(m,user,command){
    if(user.getPermission()>=this.permission){
      this.doExecute(m,user,command);
    } else {
      m.setTitle("Not enough permissions");
      m.setDescription("You don't have enough permissions to use this command. (Command permission level: "+this.permission+")");
    }
  }
};
