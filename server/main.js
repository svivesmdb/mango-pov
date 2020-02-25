const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const atlas = require('./mangoatlas')
const express = require('express')

// Express service being exposed locally
const app = express()
const port = 3000

// Connection URL
const url = 'mongodb+srv://mango:mangopovpass2020@myatlascluster-izhs1.gcp.mongodb.net/test?retryWrites=true&w=majority'
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
  // localhost:3000/stock/2/1283746/ -> base, required
  // localhost:3000/stock/2/1283746/XL
  // localhost:3000/stock/2/1283746/XL/11
  // localhost:3000/stock/2/1283746/XL/11/ShopFloor
  app.get('/stock/:tienda/:modelo?/:talla?/:color?/:ubicacion?', function (req, res) {
    atlas_rfid.getStock(req.params.tienda, req.params.modelo, req.params.talla, req.params.color, req.params.ubicacion).then((r) => {
      return res.send(r);
    });
  });

  // Dado un id del catalogo, obtener la información del mismo.
  // localhost:3000/catalog/13033008/
  app.get('/catalog/:reference', function (req, res) {
    atlas_rfid.getCatalog(req.params.reference, req.params.color).then((r) => {
      return res.send(r);
    });
  })

  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
});
