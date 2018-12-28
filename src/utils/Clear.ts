import * as Discord from 'discord.js';
import { formatedCommand } from '../typings/Global';
import { isFinite } from 'lodash';
import Message from './Message';
import __ from './msg';

export default class Clear {
  constructor(private _bot:Discord.Client){}

  static clearCommand(channel:Discord.TextChannel|Discord.DMChannel|Discord.GroupDMChannel|null, numberOfMessage:string|number, authorOfTheCommand:Discord.GuildMember):void {
    if(channel !== null && authorOfTheCommand.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES as Discord.PermissionResolvable)) {
      // s'il n'y a pas d'argument valide, alors élimine tous les message
      if(typeof numberOfMessage !== 'number') {
        try {
          numberOfMessage = parseInt(numberOfMessage);
        } catch (error) {}
      }

      if(isFinite(numberOfMessage)) {
        // clear N element(s)

        if(numberOfMessage > 0 && numberOfMessage < 100) {
          // 0 < N < 99
          Message.send(channel, `${__.Clear.YouHaveDeleted} ${numberOfMessage}**`, 7000);
          channel.bulkDelete(numberOfMessage as number)
            .then()
            .catch(error => console.error(error));
        } else {
          Message.send(channel, __.Clear.EnterNumberBetween1And99OrNoNumber, 7000);
        }

      // clear all
      } else {
        channel.bulkDelete(99, false)
          .then()
          .catch(error => console.error(error));
        Message.send(channel, __.Clear.AllMessagesHaveBeenDeleted, 7000);
      }
    }
  }

  static triggerCommand(cmd:formatedCommand):void {
    switch(cmd.command) {
      case 'clear':
        Clear.clearCommand(cmd.channel, cmd.parameters[0], cmd.member as Discord.GuildMember);
        break;
      default:
        break;
    }
  }
}
