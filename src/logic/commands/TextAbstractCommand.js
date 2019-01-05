"use strict";

const Command = require("../Command.js");

module.exports = class TextAbstractCommand extends Command {
  constructor(id,name) {
    super(id,name);
    this.addChannel("text");
  }
};
