"use strict";

const Command = require("../Command.js");

module.exports = class GlobalAbstractCommand extends Command {
  constructor(id,name) {
    super(id,name);
    this.addChannel("dm");
    this.addChannel("text");
  }
};
