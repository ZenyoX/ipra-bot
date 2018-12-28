import * as Discord from 'discord.js';
import { formatedCommand } from '../typings/Global';
import { isFinite } from 'lodash';

export default class Command {

  private static _prefix:string = '//';
  private static _commands:Array<string> = new Array();

  static setConfiguration(prefix:string, commands:Array<string>):void {
    this._prefix = prefix;
    this._commands = commands;
  }

  static setPrefix(prefixToChange:string) {
    Command._prefix = prefixToChange;
  }

  static setNewCommand(nameOfTheCommand:string) {
    this._commands.push(nameOfTheCommand);
  }

  static getAllCommand():Array<string> {
    return this._commands;
  }

  static formatCommand(messageToTransformInCommand:Discord.Message):formatedCommand {
    if(this.isValideCommand(messageToTransformInCommand.content)) {
      // séparation de la commande et de son argument
      const command = messageToTransformInCommand.content.split(' ')[0].substr(this._prefix.length);
      let parametersStr:Array<string> = messageToTransformInCommand.content.split(' ').slice(1);
      // il faut vérifier que s'il y a un paramètre vide (2 espaces dans la console) les supprimer
      parametersStr = parametersStr.filter((element) => element.length >= 1);
      // s'il y a un nombre, alors le convertir en type number
      const parameters = parametersStr.map((element:string) => {
        try {
          const number = parseFloat(element);
          if(isFinite(number)) {
            return number
          }
        } catch(error) { }
        // pour tous les autre types
        return element;
      });
      // sauvegarde avant suppression
      const member = messageToTransformInCommand.member;
      const channel = messageToTransformInCommand.channel;
      const mentions = messageToTransformInCommand.mentions;
      // suppression du message commande dans le tchat de Discord
      // une fois que la command a été reformaté correctement
      messageToTransformInCommand.delete();
      return {
        command,
        parameters,
        member,
        channel,
        mentions,
      }
    }
    return {
      command: 'NO_COMMANDE',
      parameters:[],
      member: null,
      channel: null,
      mentions: null,
    };
  }

  static isValideCommand(messageToCheck:string):boolean {
    const COMMAND_REGEX = new RegExp(`^${this._prefix}[a-zA-Z]`);
    if (COMMAND_REGEX.test(messageToCheck)) {
      const command = messageToCheck.split(' ')[0].substr(this._prefix.length);
      if(this._commands.some((element) => element === command)) {
        return true;
      } else {
        console.log(`La commande '${command}' n'a pas été enregistré. Utilisez 'setNewCommand('${command}')' si vous souhaitez l'enregistré comme valide via la class 'Command'`);
      }
    }
    return false;
  }

}
