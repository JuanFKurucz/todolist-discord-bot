'use strict';

const {dbupdate} = require(__dirname+"/DataBaseClass.js");
const Message = require('discord.js').RichEmbed;


module.exports = class Activity {
  constructor(user,client) {
    this.owner=user;
    this.message = new Message();
    this.messageId=null;
    this.title="Sample activity title";
    this.description="";
    this.tasks=[];
    this.client=client;
    var self=this;

    this.message.setTitle(this.title);

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

  editMessage(message,newContent,callback){
    message.edit(newContent)
    .then(msg => callback(msg))
    .catch(console.error);
  }

  setDescription(des){
    var self = this;
    this.description=des;
    this.getMessage(function(msg){
      var m = new Message(msg.embeds[0]);
      m.setDescription(self.description);
      self.editMessage(msg,m,function(){
        console.log("done");
      });
    });
  }

  setTitle(title){
    var self = this;
    this.title=title;
    this.getMessage(function(msg){
      var m = new Message(msg.embeds[0]);
      m.setTitle(self.title);
      self.editMessage(msg,m,function(){
        console.log("done");
      });
    });
  }

  addTask(des){
    this.tasks.push(des);
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
