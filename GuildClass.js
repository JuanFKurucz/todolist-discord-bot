'use strict';

const { dbQuery } = require(__dirname+"/DataBaseClass.js");

module.exports = class Guild {
  constructor(id) {
    this.id=id;
  }

  getId(){
    return this.id;
  }
}
