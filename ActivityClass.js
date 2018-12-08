'use strict';

const {dbupdate} = require(__dirname+"/DataBaseClass.js");
const Message = require('discord.js').RichEmbed;


module.exports = class Activity {
  constructor(user,client) {
    this.owner=user;
    this.message = new Message();
    this.messageId=null;
    this.client=client;
    var self=this;

    this.message.setTitle("Sample activity title");

    client.channels.find("name","to-do-list").send(this.message)
    .then(message => {
      this.messageId=message.id;
    }).catch(console.error);
  }

  getMessage(callback){
    if(this.messageId!=null){
      this.client.channels.find("name","to-do-list").fetchMessage(this.messageId)
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
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  print(){
    let response = this.jsUcfirst(this.description)+"\n";
    for(var t=0;t<this.tasks.length;t++){
      response += t +" - "+this.jsUcfirst(this.tasks[t])+"\n";
    }
    return response;
  }

  save(object,callback){
    var date = new Date();
    var self=this;
    var o = object;
    o["description"]=self.description;
    o["date"]=date.getTime();
    o["id_user"]=self.owner.getId();
    dbupdate("INSERT INTO activity SET ?",o,function(error, results, fields){
      if (error) {
        callback("unexpected error on activity insert");
      } else {
        var activityId=results.insertId;
        var increment=0;
        var o={
          "id_activity":activityId
        }
        for(var t=0;t<self.tasks.length;t++){
          o["description"]=self.tasks[t];
          o["number"]=t;
          dbupdate("INSERT INTO task SET ?",o,function(error, results, fields){
            if (error) {
              throw error;
              callback("unexpected error on activity insert");
            }
            increment++;
            if(increment==self.tasks.length){
              callback("activity created successfully");
            }
          });
        }
      }
    });
  }
}
