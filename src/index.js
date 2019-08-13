const app = require('./app');
const PORT = process.env.PORT;
const chalk = require('chalk');

app.listen(PORT, ()=> {
  console.log(chalk.green.bold(`Server is running on port ${PORT}`))
});