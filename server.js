const express = require('express');
const mongo = require('mongodb');
const app = express();

mongo.connect( 'mongodb://localhost:27017/shorty', ( err, db) => {
  if( err){
    throw new Error( "mongo connect failed");
  } else {
    console.log( "connected to db");
  }

  app.set('port', (process.env.PORT || 8080));
  app.use('/', express.static(process.cwd() + '/public'));

  app.get( '/', (req,res) => {
    res.sendFile( process.cwd() + '/public/index.html');
  });

  app.get( '/new/:url', (req, res) => {
    // do the magic
  });

  app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
  });
});
