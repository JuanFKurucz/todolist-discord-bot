'use strict';

const {dbupdate} = require(__dirname+"/DataBaseClass.js");


module.exports = class Activity {
  constructor(user) {
    this.owner=user;
    this.description="";
    this.tasks=[];
  }

  setDescription(des){
    this.description=des;
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
