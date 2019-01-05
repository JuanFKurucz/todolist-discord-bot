"use strict";

const Command = require("../Command.js");

module.exports = class DmAbstractCommand extends Command {
  constructor(id,name) {
    super(id,name);
    this.addChannel("dm");
  }
};
