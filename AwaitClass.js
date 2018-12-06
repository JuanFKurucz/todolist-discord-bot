'use strict';

const {dbupdate} = require(__dirname+"/DataBaseClass.js");


module.exports = class Activity {
  constructor(id_activity,id_message) {
    this.id_activity=id_activity;
    this.id_message=id_message;
  }
}
