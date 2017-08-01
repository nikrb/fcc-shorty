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

  app.get( '/:surl', (req, res) => {
    const surl = parseInt( req.params.surl, 10);
    if( isNaN( surl)){
      res.send( {error: "No such shortcode"});
    } else {
      db.collection( 'urls').findOne( { surl: surl})
      .then( (result) => {
        if( result){
          res.redirect( result.url);
        } else {
          res.send( {error: "No such shortcode"});
        }
      });
    }
  });

  app.get( '/new/*', (req, res) => {
    // validate the new url http://www.example.com
    const re = /https{0,1}:\/\/www\.[a-zA-Z0-9]+\.com/;
    const ourl = req.params[0];
    if( re.test( ourl)){
      const col = db.collection( 'urls');
      col.count().then( (count) => {
        col.insert( {url:ourl, surl: count+1})
        .then( (result) => {
          res.send( {original_url: ourl, short_url: count+1});
        });
      });
    } else {
      res.send( { original_url: null, short_url: null});
    }
  });

  app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
  });
});
