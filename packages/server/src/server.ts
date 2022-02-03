import { App } from './App';

const { express } = new App();

express.listen(3000, (err) => {
  if (err) {
    return console.error(err);
  }

  return console.info('Server is running in port: ', 3000);
});
