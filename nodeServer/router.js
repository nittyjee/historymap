const mongo = customModules('mongoQueries');
const authentication = customModules('login');

function isLoggedIn (req, res, next) {
  if (req.session && req.session.passport && req.session.passport.user) {
    next();
  } else {
    console.log('Attempted data insertion');
    return res.sendStatus(503);
  }
}

module.exports = (app) => {
  app.get('/hello_world', (req, res) => {
    res.send('hi!');
  });

  app.get('/', async (req, res) => {
    const layers = await mongo.getLayers();
    const boroughs = await sortIntoCategory('borough', layers);
    const names = Object.keys(boroughs);
    const copyOfBoroughs = JSON.parse(JSON.stringify(boroughs));

    for (let i = 0; i < names.length; i++) {
      copyOfBoroughs[names[i]] = await sortIntoCategory('feature group', boroughs[names[i]]);
    }

    const styles = await mongo.getStyles();
    const styleBoroughs = await sortIntoCategory('borough', styles);
    const styleNames = Object.keys(styleBoroughs);
    const copyOfStyles = JSON.parse(JSON.stringify(styleBoroughs));

    for (let i = 0; i < styleNames.length; i++) {
      copyOfStyles[styleNames[i]] = await sortIntoCategory('feature group', styleBoroughs[styleNames[i]]);
    }

    res.render('main.pug', { layers: copyOfBoroughs, styles: copyOfStyles, user: req.user });
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
        // if (layer[category] && !sorted[layer[category]]) {
        if (!sorted[layer[category]]) {
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

  app.get('/login', (req, res) => {
    res.render('./login.pug');
  });

  app.post('/authenticate', authentication.providerStrategy.authenticate('provider',
    { successRedirect: '/', failureRedirect: '/login' }), (req, res) => {
    req.user = req.session.user;
  });

  app.post('/getLayers', (req, res) => {
    mongo.getLayers(req.body).then((result) => {
      res.send(result);
    });
  });

  app.post('/getStyles', (req, res) => {
    mongo.getLayers(req.body).then((result) => {
      res.send(result);
    });
  });

  /**
   * @param req.body {Object} Query in the shape {_id: idString}
   */
  app.post('/getLayerById', (req, res) => {
    mongo.getLayerById(req.body._id).then((result) => {
      res.send(result);
    });
  });

  /**
   * @param req.body {Object} Query in the shape {_id: idString}
   */
  app.post('/getStyleById', (req, res) => {
    mongo.getStyleById(req.body._id).then((result) => {
      res.send(result);
    });
  });

  app.post('/saveLayer', isLoggedIn, (req, res) => {
    mongo.saveLayer(req.body).then((result) => {
      if (result.acknowledged && result.upsertedId) {
        mongo.getLayerById(result.upsertedId).then((layer) => {
          res.render('layerWidgetOnly.pug', { layer }, (err, html) => {
            if (err) throw err;
            res.send(html);
          });
        });
      }
    });
  });

  app.post('/saveStyle', isLoggedIn, (req, res) => {
    mongo.saveStyle(req.body).then((result) => {
      if (result.acknowledged && result.insertedId) {
        /*
        mongo.getLayerById(result.insertedId).then((layer) => {
          console.log(`layer ${JSON.stringify(layer)}`);
          res.render('layerWidgetOnly.pug', { layer }, (err, html) => {
            if (err) throw err;
            res.send(html);
          });
        });
        */
        // res.send(`Layer saved with local id ${result.insertedId}`);
      }
    });
  });

  app.post('/deleteLayer', isLoggedIn, (req, res) => {
    mongo.deleteLayer(req.body.id).then((result) => {
      console.log(result);
      if (result.acknowledged) {
        res.send(`Layer deleted`);
      }
    });
  });
};
