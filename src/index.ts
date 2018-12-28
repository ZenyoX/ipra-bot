// Ajouter le bot sur l'un de vos serveur discord (ou où vous avez l'autorisation d'en
// rajouter : https://discordapp.com/api/oauth2/authorize?client_id=468025428070629376&permissions=8&scope=bot

import * as Discord from 'discord.js';
import config from './assets/config/config';
import chalk from 'chalk';
import HotModuleReload from './utils/HotModuleReload';
import Global from './utils/Global';

// -------------------------------------------------------------------- configuration
Global.bot = new Discord.Client();

Global.bot.login(process.env.token);

async function onExit() {
  console.log(chalk.yellow('\nVanityBOT s\'est correctement arrêté'));
  Global.bot.removeAllListeners();
  await Global.bot.destroy();
  process.removeAllListeners();
  process.exit();
}

process.on('exit', onExit);
process.on('SIGINT', onExit);
process.on('SIGUSR1', onExit);
process.on('SIGUSR2', onExit);
process.on('uncaughtException', onExit);

// -------------------------------------------------------------------- Hot Module

Global.hotModuleReload = new HotModuleReload(__dirname + '/app', __dirname);
Global.hotModuleReload.beforeReloading(() => {
  Global.bot.removeAllListeners();
});