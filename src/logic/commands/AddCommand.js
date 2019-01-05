"use strict";

const Command = require("../Command.js");

module.exports = class AddCommand extends Command {
  constructor(id,name) {
    super(id,name);
    this.addChannel("text");
  }

  addHelp(m){
    let data = [
      {"title":"hellow dah","description":"something"}
    ];
    for(let i in data){
      m.addField(data[i].title,data[i].description);
    }
  }

  async doExecute(m,user,command){
    if(user.startActivity()){
      m.setDescription("Welcome to activity creation, below is a list of commands to help you set up the activity.");
    } else {
      m.setDescription("You already have an activity started. Please cancel or finish it first");
    }

    this.addHelp(m);

    m.setTitle("Adding an activity");
    m.setReply(true);
  }
};
