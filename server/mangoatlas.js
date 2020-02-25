class MongoDBAtlasRFID {

  constructor(client, dbName) {
    this.db = client.db(dbName);
    this.epcs = this.db.collection("epcs");
  }

  //////////////

  getCatalog(talla = null, color = null, ubicacion = null) {
    var filters = {}
    if (talla) {
      filters.talla = talla;
    }
    if (color) {
      filters.color = color;
    }
    if (ubicacion) {
      filters.tienda.ubicacion = ubicacion;
    }
    return this.epcs.find(filters).toArray();
  };

  getCatalog(reference, color = null) {
    var filters = {}
    if (talla) {
      filters.reference = reference;
    }
    if (color) {
      filters.color = color;
    }

    return this.epcs.find(filters).toArray();
  };

  getStock(tienda, modelo, talla = null, color = null, ubicacion = null) {
 
    var match = {
        "tienda.detalles.id": parseInt(tienda),
        "modelo": parseInt(modelo),
    };

    var group_by = {
      "ubicacion": "$tienda.ubicacion"
    };

    if (talla) {
      match.talla = parseInt(talla);
    } else {
      group_by["talla"] = "$talla"
    }

    if (color) {
      match.color = parseInt(color);
    } else {
      group_by["color"] = "$color"
    }

    if (ubicacion) {
      match.tienda = {}
      match.tienda.ubicacion = ubicacion;
    }

    var group_stage =  {
      "$group": {
        "_id": group_by,
        "stock": {
          "$sum": 1
        }
      }
    }

    var match_stage = {
      "$match": match
    };
    var pipe = [ match_stage, group_stage ];
    
    return this.epcs.aggregate(pipe, []).toArray();
  }
}

module.exports = MongoDBAtlasRFID;