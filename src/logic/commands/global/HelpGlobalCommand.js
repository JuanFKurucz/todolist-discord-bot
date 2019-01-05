"use strict";

const GlobalAbstractCommand = require("../GlobalAbstractCommand.js");

module.exports = class HelpCommand extends GlobalAbstractCommand {
  constructor(id,name) {
    super(id,name);
  }

  async doExecute(m,user,command){
    const bot = require("../../../Bot.js").get(),
        commandList = bot.logic.getCommands();

    m.setTitle("help_title");
    m.setDescription("help_message");
    for(let i in commandList){
      for(let k in commandList[i]){
        m.addField(
          i.toUpperCase()+" "+bot.getPrefix()+"^"+commandList[i][k].getName()+"^",
          {
            "text":"^"+commandList[i][k].getDescription()+"^",
            "data":[[bot.getPrefix(),"^"+commandList[i][k].getName()+"^"]],
            "style":"lower"
          }
        );
      }
    }
  }
};
