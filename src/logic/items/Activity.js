"use strict";

const Task = require("./Task.js");

module.exports = class Activity {
  constructor(name,description="") {
    this.name = name;
    this.description = description;
    this.tasks={};
    this.dependencies={
      "task":[],
      "activity":[]
    };
  }

  getName(){
    return this.name;
  }

  setName(n){
    this.name = n;
  }

  getDescription(){
    return this.description;
  }

  setDescription(d){
    this.description = d;
  }

  getTasks(){
    return this.tasks;
  }

  getTask(index){
    return (this.tasks.hasOwnProperty(index) === true) ? this.tasks[index] : null;
  }

  addTask(name,description=""){
    const newIndex = Object.keys(this.getTasks()).length;
    this.tasks[newIndex] = new Task(this,newIndex,name,description);
  }

  getDependencies(type=""){
    const parsedType = type.toLowerCase();
    return (this.tasks.hasOwnProperty(parsedType) === true) ? this.dependencies[parsedType] : this.dependencies
  }

  addDependencie(type,id){
    const parsedType = type.toLowerCase();
    (this.tasks.hasOwnProperty(parsedType) === true && this.dependencies[parsedType].indexOf(id) === -1) ? this.dependencies[parsedType].push(id) : null; 
  }
};
