'use strict';

const Activity = require(__dirname+"/ActivityClass.js");
const Role = require(__dirname+"/RoleClass.js");
const { dbQuery } = require(__dirname+"/DataBaseClass.js");

module.exports = class User {
  constructor(id) {
    this.id=id;
    this.roles={};
    this.guilds={};
    this.activity = null;
    this.lastMessage = null;
  }

  addGuild(guild){
    if(!this.guilds.hasOwnProperty(guild.getId())){
      this.guilds[guild.getId()]=guild;
    }
  }

  async canExecute(command){
    let currentGuild = this.getCurrentGuild();
    let guildRole = this.roles[currentGuild.id];
    let permissionLevel = 0;
    if(guildRole){
      permissionLevel=guildRole.getPermission();
    }
    let permissionNeeded = await currentGuild.getPermissionCommand(command);
    if(permissionNeeded){
      return (permissionLevel!==0) && permissionLevel<=permissionNeeded;
    }
    return true;
  }

  getCurrentGuild(){
    return this.guilds[this.lastMessage.guild.id];
  }

  getGuild(id){
    return this.guilds[id];
  }

  setLastMessage(msg){
    this.lastMessage=msg;
  }

  getMention(){
    return "<@!"+this.id+">";
  }

  getLastMessage(){
    return this.lastMessage;
  }

  getId(){
    return this.id;
  }

  getActivity(){
    return this.activity;
  }

  createActivity(client){
    this.activity = new Activity(this,client);
  }

  cancelActivity(){
    this.activity=null;
  }

  async update(){
    let results = await dbQuery("SELECT * FROM user WHERE id_user = "+this.id);
    if(results.length>0){
      results = await dbQuery("SELECT * FROM user_guild_role WHERE id_user = "+this.id);
      for(var r=0;r<results.length;r++){
        this.roles[results[r].id_guild]=await Role.get(results[r].id_role);
      }
    } else {
      var o = {
        "id_user":this.id
      };
      results = await dbQuery("INSERT INTO user SET ?",o);
    }
    return this;
  }
}
