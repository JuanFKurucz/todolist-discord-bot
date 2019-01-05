"use strict";

const DmAbstractCommand = require("../DmAbstractCommand.js");

module.exports = class ErrorPrivateCommand extends DmAbstractCommand {
  constructor(id,name) {
    super(id,name);
  }

  async doExecute(m,user,command){
    const prefix = require("../../../Bot.js").get().getPrefix();
    m.setTitle("errordm_title");
    m.setDescription("errordm_message",[prefix,"^command_help^"]);
  }
};
