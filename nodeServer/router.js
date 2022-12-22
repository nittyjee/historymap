module.exports = function(app) { 
  app.get('/', (req, res) => {
      res.render('main.pug');
  });

  app.post('/getLayers', (req, res) => {
    
  });
}