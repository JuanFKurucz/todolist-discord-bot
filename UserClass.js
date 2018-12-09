'use strict';

const Activity = require(__dirname+"/ActivityClass.js");
const { dbQuery } = require(__dirname+"/DataBaseClass.js");

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

  async update(){
    var self=this;
    let results = await dbQuery("SELECT * FROM user WHERE id_user = "+self.id);
    if(results.length>0){
      self.setPermission = results[0].permission;
    } else {
      var o = {
        "id_user":self.id,
        "permission":self.permission
      };
      results = await dbQuery("INSERT INTO user SET ?",o);
    }
    return self;
  }
}
