"use strict";

const Command = require("../Command.js");

module.exports = class HelpCommand extends Command {
  constructor(id,name) {
    super(id,name);
    this.addChannel("dm");
    this.addChannel("text");
  }

  async doExecute(m,user,command){
    const bot = require("../../Bot.js").get(),
        commandList = bot.logic.getCommands();

    m.setTitle("help_title");
    m.setDescription("help_message");
    for(let i in commandList){
      m.addField(
        bot.getPrefix()+"^"+commandList[i].getName()+"^",
        {
          "text":"^"+commandList[i].getDescription()+"^",
          "data":[[bot.getPrefix(),"^"+commandList[i].getName()+"^"]],
          "style":"lower"
        }
      );
    }
  }
};
