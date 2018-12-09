'use strict';

const { dbQuery } = require(__dirname+"/DataBaseClass.js");
let rolesDictionary = {};

module.exports = class Role {
  static async get(id){
    let role = rolesDictionary[id];
    if(!role){
      role = new Role(id);
    }
    await role.update();
    if(role.exists()){
      rolesDictionary[id]=role;
      return role;
    } else {
      return null;
    }
  }

  constructor(id) {
    this.id=id;
    this.name="";
    this.permission=0;
  }

  getId(){
    return this.id;
  }

  getPermission(){
    return this.permission;
  }

  exists(){
    return this.permission!==0;
  }

  async update(){
    let results = await dbQuery("SELECT * FROM role WHERE id_role = "+this.id);
    if(results.length>0){
      this.name=results[0].name;
      this.permission=results[0].permission;
    }
    return this;
  }
}
