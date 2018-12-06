'use strict';

const Activity = require(__dirname+"/ActivityClass.js");
const dbquery = require(__dirname+"/DataBaseClass.js");

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

  createActivity(){
    this.activity = new Activity(this);
  }

  cancelActivity(){
    this.activity=null;
  }

  update(){
    var self=this;
    dbquery("SELECT * FROM user WHERE id_user = "+self.id,function(error, results, fields){
      if (error) callback(null);
      if(results.length>0){
        self.
        this.users[info.id]=new User(results[0].id_user,results[0].permission);
        callback(this.users[info.id]);
      } else {
        dbquery("INSERT INTO user (id_user, permission) VALUES ("+info.id+",0)",function(error, results, fields){
          this.users[info.id]=new User(info.id,0);
          callback(this.users[info.id]);
        });
      }
    });
  }
}
