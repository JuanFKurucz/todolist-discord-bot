'use strict';

const { dbQuery } = require(__dirname+"/DataBaseClass.js");

module.exports = class Guild {
  constructor(id) {
    this.id=id;
    this.config={};
  }

  async getPermissionCommand(command){
    let results = await dbQuery("SELECT * FROM guild_permission WHERE id_guild = '"+this.id+"' AND command='"+command+"'");
    console.log(results);
    if(results.length>0){
      return results[0].id_role;
    } else {
      return 0;
    }
  }

  getId(){
    return this.id;
  }

  async update(){
    let results = await dbQuery("SELECT * FROM guild WHERE id_guild = "+this.id);
    if(results.length===0){
      var o = {
        "id_guild":this.id
      };
      results = await dbQuery("INSERT INTO guild SET ?",o);
    }
    return this;
  }
}
