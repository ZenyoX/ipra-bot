import Global from './utils/Global';
import * as Discord from 'discord.js';
import config from './assets/config/config';
import Command from './utils/Command';
import chalk from 'chalk';
import Clear from './utils/Clear';
import Console from './utils/console';
import MusicHandler from './utils/MusicHandler';
// import DynamicChannel from './utils/DynamicChannel';

// -------------------------------------------------------------------- configuration

// const fortniteDuoDynamic = new DynamicChannel(Global.bot,'497845367459807232','Duo', 2);
// fortniteDuoDynamic.onListening();

//  Global.hotModuleReload.beforeReloading(() => {
//   fortniteDuoDynamic.removeAllChannel();
// });

Global.bot.on('ready', () => {
  Global.bot.user.setActivity('Devenir un BOT solide !');
  if(config.isInProduction) {
    Console.log(chalk.yellow('VanityBOT') + ' ' + chalk.yellow.underline('mode production'));
    Console.isColored = false;
    Console.isShowError = false;
    Console.isShowWarn = false;
  } else {
    Console.log(chalk.yellow('VanityBOT') + ' ' + chalk.yellow.underline('mode développement'));
  }
});

Command.setConfiguration('//', new Array(
  'clear', 'say', 'help', 'hug', 'slap', 'tap',
  'roll', 'rps', 'hentai', '&', 'join', 'leave',
  'play', 'pause', 'resume', 'list', 'add', 'remove',
  'next', 'stop', 'volume', 'lang'
));
// -------------------------------------------------------------------- main
Global.bot.on('message', async (message:Discord.Message) => {
  // discord envoie bizarre plusieurs message '' apres la reception d'un vrais message
  if(message.content !== '') {
    Console.tchatMessage(message);
    checkAllCommand(message);
  }
});

function checkAllCommand(message:Discord.Message) {
  if(Command.isValideCommand(message.content)) {
    const msgCMD = Command.formatCommand(message);
    switch(msgCMD.command) {
      case 'clear':
        Clear.triggerCommand(msgCMD);
        break;
      case 'hug':
      case 'slap':
      case 'tap':
        // EmotionalMessage.triggerCommand(msgCMD);
        break;
      case 'join':
      case 'leave':
      case 'play':
      case 'pause':
      case 'resume':
      case 'list':
      case 'add':
      case 'remove':
      case 'next':
      case 'stop':
      case 'volume':
        MusicHandler.triggerCommand(msgCMD);
        break;
      default:
        break;
    }
  }
}
