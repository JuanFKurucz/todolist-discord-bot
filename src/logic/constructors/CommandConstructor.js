"use strict";

const Constructor = require("../Constructor.js"),
      fs = require("fs");

module.exports = class CommandConstructor extends Constructor {
  loadCommands(dir,elements,namesCheck,i){
    let files = fs.readdirSync(dir);

    files.forEach((file) => {
      if (fs.statSync(dir + file).isDirectory()) {
        this.loadCommands(dir + file + '/', elements, namesCheck, i);
      } else {
        if(file.toLowerCase().indexOf("abstract")===-1){
          const pathDir = dir.toLowerCase().split("/"),
                type = pathDir[pathDir.length-2],
                fileName = file.toLowerCase(),
                name = fileName.substring(0,fileName.lastIndexOf(type+"command"));

          if(namesCheck.hasOwnProperty(name) === false || namesCheck[name] !== type){
            elements[i]={
              name,
              "constructor":require("../commands/"+type+"/"+file)
            };
            namesCheck[name]=type;
            i++;
          } else {
            console.error(type+" "+name+" already exists as a command. DUPLICATED COMMAND NAME",0);
          }
        }
      }
    });
  }

  constructor(botprefix){
    const commandsFolder = "./src/logic/commands/",
          files = fs.readdirSync(commandsFolder),
          elements = {},
          namesCheck = {};
    let i=0;
    super("Command",elements);

    this.loadCommands(commandsFolder,elements,namesCheck,i);
    console.info(elements);
    this.elements = elements;
    this.botPrefix=botprefix;
  }

  initCommands(){
    let commands = {
          "global":{},
          "text":{},
          "dm":{}
        },
        object = null;
    for(let e in this.elements){
      object=this.create(e);
      console.info(object);
      let channels = object.getChannels();
      if(channels.length === 1){
        commands[channels[0]]["command_"+object.name]=object;
      } else {
        commands["global"]["command_"+object.name]=object;
      }
    }

    return commands;
  }

  createObject(id,commandInfo){
    return new commandInfo.constructor(
      id,
      commandInfo.name
    );
  }
};
