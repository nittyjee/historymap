const mongo = customModules('mongoQueries');

module.exports = (app) => {
  app.get('/hello_world', (req, res) => {
    res.send('hi!');
  });

  app.get('/', async (req, res) => {
    const dutchLots = await mongo.getDutchLots();
    const taxLots = await mongo.getTaxLots();
    const layers = { dutchLots, taxLots };
    res.render('main.pug', { layers });
  });

  app.get('/dutchLots', (req, res) => {
    mongo.getDutchLots().then((result) => res.send(result));
  });

  app.get('/taxLots', (req, res) => {
    mongo.getTaxLots().then((result) => res.send(result));
  });

  app.post('/getLayers', (req, res) => {
    
  });
};
