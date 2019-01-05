"use strict";

const DmAbstractCommand = require("../DmAbstractCommand.js");

module.exports = class NameDmCommand extends DmAbstractCommand {
  constructor(id,name) {
    super(id,name);
    this.addChannel("dm");
  }

  async doExecute(m,user,command){
    const activity = user.getActivity();
    let response = "";

    if(activity !== null){
      if(command.length>1){
        command.shift();
        let name = command.join(" ");
        activity.setName(name);
        response = "Name of the activity set to: "+name;
      } else {
        response = "You need to write a name";
      }
    } else {
      response = "You are not creating an activity";
    }

    m.setTitle("Set activity name");
    m.setDescription(response);
  }
};
