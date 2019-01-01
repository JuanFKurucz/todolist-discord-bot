"use strict";

module.exports = class Task {
  constructor(activity,index,name,description="") {
    this.activity = activity;
    this.index = index;
    this.name = name;
    this.description = description;
    this.dependencies={
      "task":[],
      "activity":[]
    };
  }

  getActivity(){
    return this.activity;
  }

  setActivity(a){
    this.activity = a;
  }

  getIndex(){
    return this.index;
  }

  setIndex(i){
    const indexTask = this.getActivity().getTask(i);
          currentIndex = this.index;
    this.index = -1;
    if(indexTask !== null){
      indexTask.setIndex(currentIndex);
    }
    this.index = i;
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

  getDependencies(type=""){
    const parsedType = type.toLowerCase();
    return (this.tasks.hasOwnProperty(parsedType) === true) ? this.dependencies[parsedType] : this.dependencies
  }

  addDependencie(type,id){
    const parsedType = type.toLowerCase();
    (this.tasks.hasOwnProperty(parsedType) === true && this.dependencies[parsedType].indexOf(id) === -1) ? this.dependencies[parsedType].push(id) : null;
  }
};
