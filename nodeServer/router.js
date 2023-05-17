const mongo = customModules('mongoQueries');

module.exports = (app) => {
  app.get('/hello_world', (req, res) => {
    res.send('hi!');
  });

  app.get('/', async (req, res) => {
    const layers = await mongo.getLayers();
    const boroughs = await sortIntoCategory('borough', layers);
    const boroughsNames = Object.keys(boroughs);

    if (boroughs) {
      // loop through boroughs:
      for (let i = 0; i < boroughsNames.length; i++) {
        // loop through borough object keys:
        console.log(`boroughs keys ${Object.keys(boroughs)}`);
        const borough = boroughsNames[i];
        console.log(borough);
        const layersInBorough = boroughs[borough];

        for (let j = 0; j < layersInBorough.length; j++) {
          const layerKeys = Object.keys(layersInBorough[j]);
          if (layerKeys.includes('feature group')) {
            console.log('feature group')
            const featureGroup = await sortIntoCategory('feature group', boroughs[borough]);
            boroughs[borough] = featureGroup;
            const util = require('util');
            console.log(util.inspect(boroughs, { showHidden: false, depth: 4, colors: true }));
            res.render('main.pug', { layers: boroughs });
          }
        }
      }
    } else {
      // no layers to render:
      res.render('main.pug', { layers: null });
    }
  });

  function sortIntoCategory (category, array) {
    const sorted = {};
    const promise = new Promise((resolve, reject) => {
      for (let i = 0; i < array.length; i++) {
        const layer = array[i];
        // if the category exists in sorted
        if (Object.keys(sorted).includes(layer[category])) {
          sorted[layer[category]].push(layer);
        }
        // if the layer actually has the property "category"
        if (layer[category]) {
          sorted[layer[category]] = [layer];
        }
        if (i === array.length - 1) {
          resolve(sorted);
        }
      }
    });
    return promise;
  }

  app.get('/dutchLots', (req, res) => {
    mongo.getDutchLots().then((result) => res.send(result));
  });

  app.get('/taxLots', (req, res) => {
    mongo.getTaxLots().then((result) => res.send(result));
  });

  app.post('/getLayers', (req, res) => {
    mongo.getLayers(req.body).then((result) => {
      res.send(result);
    });
  });

  /**
   * @param req.body {Object} Query in the shape {_id: idString}
   */
  app.post('/getLayerById', (req, res) => {
    mongo.getLayerById(req.body._id).then((result) => {
      console.log(result);
      res.send(result);
    });
  });

  app.post('/saveLayer', (req, res) => {
    mongo.saveLayer(req.body).then((result) => {
      if (result.acknowledged && result.insertedId) {
        mongo.getLayerById(result.insertedId).then((layer) => {
          console.log(`layer ${JSON.stringify(layer)}`);
          res.render('layerWidgetOnly.pug', {layer}, (err, html) => {
            if (err) throw err;
            res.send(html);
          });
        });
        // res.send(`Layer saved with local id ${result.insertedId}`);
      }
    });
  });

  app.post('/deleteLayer', (req, res) => {
    mongo.deleteLayer(req.body.id).then((result) => {
      console.log(result);
      if (result.acknowledged) {
        res.send(`Layer deleted`);
      }
    });
  });
};
