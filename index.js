'use strict';

/**
  This index.js is meant to work as any main file of any project.

  Here are the main variables that we need to start the bot, token and botId, in the future there will be databases credentials.

  Here we just call for Bot and DataBase classes and start them.
**/

const Bot = new require(__dirname+"/BotClass.js");
const token = 'NTIwMDA4NzYwNTMwNTY3MjEw.Dunnjg.9DYIFts-TkaJBOUWjXwg0YDl558';

let botObject = new Bot(".");
botObject.start(token);