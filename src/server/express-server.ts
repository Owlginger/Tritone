import express, { Application, Request, Response } from 'express';

class TritoneApp {
  tritone: Application;
  port: number;

  constructor() {
    this.tritone = express();
    this.port = 3000;
  }


   run: Function = () => {

    this.tritone.use('/', express.static('tritone'));

    this.tritone.listen(this.port, () => {
      console.log(`Tritone App listening on port ${this.port}`);
    });
  }
}

new TritoneApp().run();