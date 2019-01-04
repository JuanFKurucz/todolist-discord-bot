"use strict";

const Language = require("../Language.js"),
      Activity = require("./items/Activity.js");

module.exports = class User {
  constructor(id) {
    this.mention="<@!"+id+">";
    this.id=id;
    this.info=null;
    this.messageLang = null;
    this.lastResponse = null;
    this.lastMessage = null;
    this.permission=-1;

    this.activity = null;
  }

  setPermission(p){
    this.permission=p;
  }

  getPermission(){
    return this.permission;
  }

  resetResponses(){
    this.lastResponse = null;
  }

  async setLastResponse(message){
    this.lastResponse=message;
  }

  setLastMessage(message){
    this.lastMessage=message;
  }

  getLanguage(){
    if(this.messageLang === null){
      let id = "";
      if(this.info !== null){
        id=this.info.lastMessage.channel.id;//this.info.lastMessage.channel.member.guild.id;
      }
      return Language.getLan(id);
    } else {
      return this.messageLang;
    }
  }

  setMessageLang(lan){
    this.messageLang=lan;
  }

  emptyMessageLang(){
    this.messageLang=null;
  }

  getId(){
    return this.id;
  }

  getName(){
    return (this.info !== null) ? this.info.username : null;
  }

  getAvatar(){
    return (this.info !== null) ? "https://cdn.discordapp.com/avatars/"+this.getId()+"/"+this.info.avatar+".webp?size=128" : null;
  }

  setInfo(info){
    this.info=info;
  }

  startActivity(){
    if(this.activity === null){
      this.activity = new Activity();
      return true;
    }
    return false;
  }

};
