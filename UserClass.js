'use strict';

const Activity = require(__dirname+"/ActivityClass.js");
const {dbupdate} = require(__dirname+"/DataBaseClass.js");

module.exports = class User {
  constructor(id) {
    this.id=id;
    this.permission=0;

    this.activity = null;
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

  setPermission(p){
    this.permission=p;
  }

  update(callback){
    var self=this;
    dbupdate("SELECT * FROM user WHERE id_user = "+self.id,function(error, results, fields){
      if (error) throw error;
      if(results.length>0){
        self.setPermission = results[0].permission;
        callback(self);
      } else {
        var o = {
          "id_user":self.id,
          "permission":self.permission
        };
        dbupdate("INSERT INTO user SET ?",o,function(error, results, fields){
          if (error) throw error;
          callback(self);
        });
      }
    });
  }
}
