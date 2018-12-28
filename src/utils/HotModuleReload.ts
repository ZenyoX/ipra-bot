/// <reference path="../typings/invalidateModule.d.ts" />
import chokidar from 'chokidar';
import invalidate from 'invalidate-module';
import path from 'path';
import chalk from 'chalk';
import readline from 'readline';


export default class HotModuleReload {
  numberOfChangedSinceBegining: number;
  exeCallbackBeforeUpdate: Array<()=>void> = new Array();
  exeCallbackAfterUpdate: Array<()=>void> = new Array();

  constructor(public absolutePathModule:string, public pathFilter = '**/*.js', public verbose = true) {
    this.numberOfChangedSinceBegining = 0;
    this.clearScreen();
    this.textAlignCenter(chalk.yellow(`Module watch : ${absolutePathModule}\n`));
    this.requireModule();
    this.watchFiles();
  }

  requireModule() {
    try {
      import(this.absolutePathModule);
    } catch (err) {
      console.error(err);
    }
  }

  watchFiles() {
    const chokidarOption = {
      ignored: /(^|[\/\\])\../,
      ignoreInitial: true,
    }

    chokidar
      .watch(this.pathFilter, chokidarOption)
      .on('change', (pathFile) => {
        this.exeCallbackBeforeUpdate.forEach((callback) => callback());
        this.numberOfChangedSinceBegining++;
        if(this.verbose === true) {
          this.clearScreen();
          this.textAlignCenter(chalk.green(`File modified : ${pathFile} \n`));
          this.textAlignCenter(chalk.yellow(`Code update : ${this.numberOfChangedSinceBegining} `));
        }
        invalidate(path.resolve(pathFile));
        // invalidate(path.resolve(this.absolutePathModule));
        this.requireModule();
        this.exeCallbackAfterUpdate.forEach((callback) => callback());
      });
  }

  clearScreen() {
    if (Number.isFinite(process.stdout.rows as number)) {
      const blancScreen = `\n`.repeat(process.stdout.rows as number);
      console.log(blancScreen);
      readline.cursorTo(process.stdout, 0, 0);
      readline.clearScreenDown(process.stdout);
    } else {
      console.log('process.stdout.rows n\'est pas un nombre');
    }
  }

  textAlignCenter(message: string) {
    let halfWindowSize = ((process.stdout.columns as number)/2) - (message.length / 2);
    if (halfWindowSize < 0) halfWindowSize = 0;
    const halfBlanc = ` `.repeat(halfWindowSize);
    console.log(halfBlanc + message)
  }

  beforeReloading(callback:()=>void) {
    this.exeCallbackBeforeUpdate.push(callback);
  }

  afterReloading(callback:()=>void) {
    this.exeCallbackAfterUpdate.push(callback);
  }
}