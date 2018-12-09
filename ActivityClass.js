'use strict';

const { dbQuery } = require(__dirname+"/DataBaseClass.js");
const Message = require('discord.js').RichEmbed;


module.exports = class Activity {
  constructor(user,client) {
    this.channelToDo="general";
    this.owner=user;
    this.message = new Message();
    this.messageId=null;
    this.channelId=null;
    this.guildId=null;
    this.client=client;
    var self=this;

    this.message.setTitle("Sample activity title");

    client.channels.find("name",this.channelToDo).send(this.message)
    .then(message => {
      this.messageId=message.id;
      this.channelId=message.channel.id;
      this.guildId=message.guild.id;
    }).catch(console.error);
  }

  getMessage(callback){
    if(this.messageId!=null){
      this.client.channels.find("name",this.channelToDo).fetchMessage(this.messageId)
      .then(message => {
        callback(message);
      })
      .catch(console.error);
    } else {
      callback(null);
    }
  }

  editMessage(){
    var self = this;
    this.getMessage(function(msg){
      msg.edit(self.message)
      .catch(console.error);
    });
  }

  setDescription(des){
    this.message.setDescription(des);
    this.editMessage();
  }

  setTitle(title){
    this.message.setTitle(title);
    this.editMessage();
  }

  setTaskTitle(title,number=-1){
    if(number==-1){
      console.log(title);
      this.message.addField(title,"...");
    } else if(number>=0 && number<this.message.fields.length) {
      this.message.fields[number].name = title;
    }
    this.editMessage();
  }

  setTaskDescription(des,number=-1){
    if(number==-1){
      this.message.fields[this.message.fields.length-1].value = des;
    } else if(number>=0 && number<this.message.fields.length) {
      this.message.fields[number].value = des;
    }
    this.editMessage();
  }

  jsUcfirst(string){
    if(string){
      return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
      return "";
    }
  }

  print(){
    let response = this.jsUcfirst(this.message.description)+"\n";
    for(var t=0;t<this.message.fields.length;t++){
      response += t +" - "+this.jsUcfirst(this.message.fields[t])+"\n";
    }
    return response;
  }

  async save(o){
    o["title"]=this.message.title;
    o["description"]=this.message.description;
    o["date"]=(new Date()).getTime();
    o["id_user"]=this.owner.getId();
    let results = await dbQuery("INSERT INTO activity SET ?",o);
    console.log(results);
    if(results){
      var activityId=results.insertId;

      o = { "id_activity":activityId };

      for(var t=0;t<this.message.fields.length;t++){
        o["title"]=this.message.fields[t].name;
        o["description"]=this.message.fields[t].value;
        o["number"]=t;
        results = await dbQuery("INSERT INTO task SET ?",o);
        console.log(results);
        if(!results){
          return "Unexpected error";
        }
      }

      return "activity created successfully";
    } else {
      return "Unexpected error";
    }
  }
}
