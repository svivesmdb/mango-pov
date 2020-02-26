class MongoDBAtlasRFID {

  constructor(client, dbName) {
    this.db = client.db(dbName);
    this.epcs = this.db.collection("epcs");
    this.catalog = this.db.collection("catalog");
  }

  //////////////

  getByEan(ean) {
    return this.epcs.find({"ean":ean}).toArray();
  }

  getByEpc(epc) {
    return this.epcs.find({"epc":epc}).toArray();
  }

  getCatalogByReference(reference) {
    return this.catalog.find({"reference":reference}).toArray();
  };

  getCatalogByEan(reference) {
    return this.catalog.find({"ean13":reference}).toArray();
  };

  getStock(tienda, modelo = null, /*talla = null,*/ color = null, ubicacion = null) {

    var match = {
      "tienda": tienda,
      //"modelo": modelo,
    };

    var group_by = {
      "ubicacion": "$ubicacion"
    };

    /*if (talla) {
      match.talla = parseInt(talla);
    } else {
      group_by["talla"] = "$talla"
    }*/

    if (modelo) {
      match.modelo = modelo;
    } else {
      group_by["modelo"] = "$modelo"
    }

    if (color) {
      match.color = color;
    } else {
      group_by["color"] = "$color"
    }

    if (ubicacion) {
      match.ubicacion = ubicacion;
    }

    var group_stage = {
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
    var pipe = [match_stage, group_stage];

    return this.epcs.aggregate(pipe, []).toArray();
  }
}

module.exports = MongoDBAtlasRFID;