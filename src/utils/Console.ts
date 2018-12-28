import chalk from 'chalk';
import moment from 'moment';
import { Message } from 'discord.js';

export default class Console {
  static botName:string = 'Synergia';
  static isShowLog:boolean = true;
  static isShowWarn:boolean = true;
  static isShowError:boolean = true;
  static isShowTchatLog:boolean = true;
  static tabulation = '\t';
  static isColored:boolean = true;

  private static getTimeNow():string {
    if(this.isColored) {
      return chalk.yellow(moment().format('LL')+' '+moment().format('LTS')) + Console.tabulation;
    } else {
      return moment().format('LL')+' '+moment().format('LTS') + Console.tabulation;
    }
  }

  static log(message:string|number|boolean):void {
    if(Console.isShowLog) {
      if(Console.isColored) {
        console.log(`${Console.getTimeNow()} ${chalk.hex('#AAAAAA')('  Log :')} ${chalk.hex('#0DAB10').bold('Node :')} ${chalk.yellow(Console.botName)} ${chalk.greenBright('>>')} ${chalk.hex('#0DAB10').bold(String(message))}`);
      } else {
        console.log(`${Console.getTimeNow()}   Log : Node : ${Console.botName} '>> ${message}`);
      }
    }
  }

  static warn(message:string|number|boolean):void {
    if(Console.isShowWarn) {
      if(Console.isColored) {
        console.log(`${Console.getTimeNow()} ${chalk.hex('#AAAAAA')(' Warn :')} ${chalk.hex('#FF851B').bold('Node :')} ${chalk.yellow(Console.botName)} ${chalk.greenBright('>>')} ${chalk.hex('#FF851B').bold(String(message))}`);
      } else {
        console.log(`${Console.getTimeNow()}  Warn : Node : ${Console.botName} >> ${message}`);
      }
    }
  }

  static error(message:string|number|boolean):void {
    if(Console.isShowError) {
      if(Console.isColored) {
        console.log(`${Console.getTimeNow()} ${chalk.hex('#AAAAAA')('Error :')} ${chalk.hex('#DA4030').bold('Node :')} ${chalk.yellow(Console.botName)} ${chalk.greenBright('>>')} ${chalk.hex('#DA4030').bold(String(message))}`);
      } else {
        console.log(`${Console.getTimeNow()} Error : Node : ${Console.botName} >> ${message}`);
      }
    }
  }

  static tchatMessage(message:Message):void {
    if(Console.isShowTchatLog) {
      const thisChannel:any = message.channel;
      if(Console.isColored) {
        console.log(`${Console.getTimeNow()} ${chalk.hex('#AAAAAA')('Tchat :')} ${chalk.hex('#3D9970').bold(thisChannel.name+' : ')}${chalk.yellow(message.member.displayName)} ${chalk.greenBright('>>')} ${chalk.yellow(message.content)}`);
      } else {
        console.log(`${Console.getTimeNow()} Tchat : ${thisChannel.name} : ${message.member.displayName} >> ${message.content}`);
      }
    }
  }
}
