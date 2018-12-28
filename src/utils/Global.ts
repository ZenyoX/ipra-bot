import HotModuleReload from './HotModuleReload';
import * as Discord from 'discord.js';

export default class Global {
  static hotModuleReload: HotModuleReload;
  static bot: Discord.Client;
}