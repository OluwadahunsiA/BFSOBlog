const config = require('./utils/config');
const app = require('./app');

app.listen(config.PORT, () => {
  console.log(`server running on PORT ${config.PORT}`);
});
