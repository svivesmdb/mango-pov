const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const atlas = require('./mangoatlas')
const express = require('express')

// Express service being exposed locally
const app = express()
const port = 3000

// Connection URL
const url = 'mongodb+srv://mango:mangopovpass2020@mangopov-izhs1.mongodb.net/test?retryWrites=true&w=majority'
const dbName = 'mango';

// Create a new MongoClient
const client = new MongoClient(url,{useUnifiedTopology: true});

// Use connect method to connect to the Server
client.connect(function(err) {
  
  assert.equal(null, err);

  console.log("Connected successfully to MongoDB server...");

  atlas_rfid = new atlas(client, dbName);

  // Dado un modelo, cuanto stock tengo, donde y de qué color?
  //  - Tienda y modelo necesario
  //  - Color y ubicacion opcional.
  //  - Granularidar maxima, de este modelo, talla y color en el almacén
  // localhost:3000/stock/tda00001/13033008/ -> base, required
  // localhost:3000/stock/tda00001/13033008
  // localhost:3000/stock/tda00001/13033008/15
  // localhost:3000/stock/tda00001/13033008/15/Almacén
  //app.get('/stock/:tienda/:modelo?/:talla?/:color?/:ubicacion?', function (req, res) {
  app.get('/stock/:tienda/:modelo?/:color?/:ubicacion?', function (req, res) {
    atlas_rfid.getStock(req.params.tienda, req.params.modelo, /*req.params.talla,*/ req.params.color, req.params.ubicacion).then((r) => {
      return res.send(r);
    });
  });


  // Ver el estado de un EAN
  // localhost:3000/ean/842790702300
    app.get('/ean/:ean', function (req, res) {
      atlas_rfid.getByEan(req.params.ean).then((r) => {
        return res.send(r);
      });
    });

  // Ver el estado de un EPC
  // localhost:3000/ean/EPC1
  app.get('/epc/:epc', function (req, res) {
    atlas_rfid.getByEpc(req.params.epc).then((r) => {
      return res.send(r);
    });
  });
    
    
  // Dado un id del catalogo, obtener la información del mismo.
  // localhost:3000/catalog_ref/33100847/
  app.get('/catalog_ref/:reference', function (req, res) {
    atlas_rfid.getCatalogByReference(req.params.reference).then((r) => {
      return res.send(r);
    });
  })

    // Dado un id del catalogo, obtener la información del mismo.
  // localhost:3000/catalog_ean/331008479998/
  app.get('/catalog_ean/:ean13', function (req, res) {
    atlas_rfid.getCatalogByEan(req.params.ean13).then((r) => {
      return res.send(r);
    });
  })

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));

});
