const mongo = customModules('mongoQueries');

module.exports = (app) => {
  app.get('/hello_world', (req, res) => {
    res.send('hi!');
  });

  app.get('/', async (req, res) => {
    //const dutchLots = await mongo.getDutchLots();
    //const taxLots = await mongo.getTaxLots();
    const layers = await mongo.getLayers();
    res.render('main.pug', { layers });
  });

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
    console.log(req.body);
    mongo.saveLayer(req.body).then((result) => {
      if (result.acknowledged && result.insertedId) {
        res.send(`Layer saved with local id ${result.insertedId}`);
      }
    });
  });
};
