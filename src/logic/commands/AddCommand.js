"use strict";

const Command = require("../Command.js");

module.exports = class AddCommand extends Command {
  constructor(id,name) {
    super(id,name);
    this.addChannel("text");
  }

  async doExecute(m,user,command){
    console.time();

    if(user.startActivity()){
      m.setDescription("A private message has been send to you with the activity creation.");
    } else {
      m.setDescription("You already have an activity started. Please cancel or finish it first");
    }

    m.setTitle("Adding an activity");
    console.time();
  }
};
