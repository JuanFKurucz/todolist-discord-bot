"use strict";

const Command = require("../Command.js");

module.exports = class ErrorPrivateCommand extends Command {
  constructor(id,name) {
    super(id,name);
    this.addChannel("dm");
  }

  async doExecute(m,user,command){
    const prefix = require("../../Bot.js").get().getPrefix();
    m.setTitle("errorprivate_title");
    m.setDescription("errorprivate_message",[prefix,"^command_help^"]);
  }
};
