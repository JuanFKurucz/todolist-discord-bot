'use strict';

const dbquery = require(__dirname+"/DataBaseClass.js");

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
    this.task.push(des);
  }

  save(callback){
    var date = new Date();
    var self=this;
    var o = {
      "description":this.description,
      "date":date.getTime(),
      "id_user":user.getId()
    }
    dbquery("INSERT INTO activity SET ?",o,function(error, results, fields){
      if (err) {
        callback("unexpected error on activity insert");
      } else {
        var activityId=results.insertId;
        var increment=0;
        for(var t=0;t<self.tasks.length;t++){
          var o={
            "description":self.tasks[t],
            "id_activity":activityId
          }
          dbquery("INSERT INTO activity SET ?",o,function(error, results, fields){
            if (err) {
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
