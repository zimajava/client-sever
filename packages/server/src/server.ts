import { App } from './App';

const { express } = new App();

express.listen(process.env.PORT, (err) => {
  if (err) {
    return console.error(err);
  }

  return console.info('Server is running in port: ', process.env.PORT);
});
