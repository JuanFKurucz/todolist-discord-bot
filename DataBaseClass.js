'use strict';

/**
  This currently does nothing
**/
const mysql = require('mysql');

class DataBase {
  constructor(){
    this.con=mysql.createConnection({
      connectionLimit: 100,
      host: "localhost",
      user: "root",
      password: "",
      database: "todolist-bot",
      debug: false
    });
    this.start();
  }
  start(){
    this.con.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
    });
  }

}

const database = new DataBase();
module.exports = function query(string,callback){
  database.con.query(string,callback);
}