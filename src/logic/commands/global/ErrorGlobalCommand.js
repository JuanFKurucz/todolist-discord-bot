"use strict";

const TextAbstractCommand = require("../TextAbstractCommand.js");

module.exports = class ErrorCommand extends TextAbstractCommand {
  constructor(id,name) {
    super(id,name);
    this.addChannel("text");
  }

  async doExecute(m,user,command){
    const prefix = require("../../../Bot.js").get().getPrefix();
    m.setTitle("error_title");
    m.setDescription("error_message",[prefix,"^command_help^"]);
  }
};
