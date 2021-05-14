// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
//const admin = require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Text, Card, Image, Suggestion, Payload} = require( 'dialogflow-fulfillment' );
const mysql = require('mysql');
//admin.initializeApp({
    //credential :admin.credentian.applicationDefault(),
   //databaseURL:'erpcal4care.cesb3yl7kjik.ap-southeast-1.rds.amazonaws.com'
//});
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to OmniChannels!`);
    agent.add( new Card( {
        title: `OmniChannels`,
        text: `Did you know already mysite if not visit it now! `,
        buttonText: 'OurSite',
        buttonUrl:' http://omni.mconnectapps.com/'
      } )
    );
    
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  
  


function connectToDatabase(){
     const connection = mysql.createConnection({
     // host   : '172.31.15.34',
      host     : 'erpcal4care.cesb3yl7kjik.ap-southeast-1.rds.amazonaws.com',
      user     : 'cal4care',
      password : '?uniquE123',
      database : 'omni_new'
    });
   return new Promise((resolve,reject) => {
             connection.connect(function(err) {
               if (err) {
                        reject(err);
                         }
                     else{
                           resolve(connection);
                         }
                  });
   
    
    });
  }
  
  function queryDatabase(connection){
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * from chat_question`, (error, results, fields) => {
        resolve(results);
      });
    });
  }


// get a question and answer  
  
  function handleReadFromMySQL(agent){
    const user_qusn = agent.parameters.qusn_get;
    return connectToDatabase()
        .then(connection => {
          return queryDatabase(connection)
                .then(result => {
                  console.log(result);
                         result.map(chat_question => {
                              if(user_qusn === chat_question.question){
                                 //agent.add(``);
                                  agent.add(`Answer is:  ${chat_question.answer}`);
                                  agent.add(`Do you have another question for your clarification?`);

                              // agent.setFollowupEvent({ "name": "get_ans", "parameters" : { "received": "false"}});
                                  }  
                            });    
                  connection.end();
                       });
            })
           .catch( ( error ) =>{
                         agent.add('Some server problem occured' );
                         
                  } );
    }

 //update a question 
  
  function updateDatabase(connection, data){
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE chat_question SET ? WHERE question = ?`, [data, data.question], (error, results, fields) => {
        resolve(results);
      });
    });
  }
  
  function handleUpdateMysql(agent){
    const qusn= agent.parameters.qusn_upd;
    const ans = agent.parameters.ans_upd;
    const data = {
       question:qusn,
       answer : ans
    };
    return connectToDatabase()
    .then(connection => {
      return updateDatabase(connection, data)
      .then(result => {
 		agent.add(`updated Successfully`);       
        connection.end();
      });
    });
  }
  
  // add questions in db
  //write in DB............
   function insertIntoDatabase(connection, data){
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO chat_question SET ?`, data, (error, results, fields) => {
        resolve(results);
      });
    });
  }
  function handleWriteIntoMysql(agent){
      const  qusn=agent.parameters.qusn_add;
      const  ans=agent.parameters.ans_add;
    const data = {
        question: qusn,
        answer: ans
      };
    return connectToDatabase()
    .then(connection => {
      return insertIntoDatabase(connection, data)
      .then(result => {
 		agent.add(`Your Question and Answer are Succesfully inserted`);       
        connection.end();
      });
    });
  }
  
 //delete a question
  
    function deleteFromDatabase(connection, qusn){
    return new Promise((resolve, reject) => {
      connection.query(`DELETE from chat_question WHERE question = ?`, qusn, (error, results, fields) => {
        resolve(results);
      });
    });
  }
  function handleDeleteFromMysql(agent){
    const qusn = agent.parameters.qusn_del;
    return connectToDatabase()
    .then(connection => {
      return deleteFromDatabase(connection, qusn)
      .then(result => {
 		agent.add(`Data deleted`);       
        connection.end();
      });
    });
  }
  
  
   let intentMap = new Map();
   intentMap.set('Default Welcome Intent', welcome);
   intentMap.set('Default Fallback Intent', fallback);
   intentMap.set('getDataFromMySQL - yes', handleReadFromMySQL); 
   intentMap.set('getDataFromMySQL', handleReadFromMySQL);
  //intentMap.set('getDataFromMySQL,getDataFromMySQL - yes', handleReadFromMySQL);
    intentMap.set('writeDataIntoMysql', handleWriteIntoMysql);
    intentMap.set('updateMysql', handleUpdateMysql);
    intentMap.set('deleteFromMysql', handleDeleteFromMysql);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
