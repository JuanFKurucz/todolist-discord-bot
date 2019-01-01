"use strict";

const Command = require("../Command.js");

module.exports = class AddCommand extends Command {
  constructor(id,name) {
    super(id,name);
  }

  async doExecute(m,user,command){
    console.time();
    m.setTitle("Hello dah");
    m.setDescription("Am I a joke to you?");
    console.time();
  }
};
