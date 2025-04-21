const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

server.use((req, res, next) => {
  const invalidIdMatch = req.url.match(/\/\w+\/(null|undefined)(\/)?$/);
  if (invalidIdMatch) {
    return res.status(400).json({ error: 'Invalid ID in URL' });
  }
  next();
});

server.use(middlewares);

server.use(jsonServer.rewriter({
  '/api/*': '/$1',
  '/blog/:resource/:id/show': '/:resource/:id'
}));

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});
