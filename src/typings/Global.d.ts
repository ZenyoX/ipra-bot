import * as Discord from 'discord.js';

export interface formatedCommand {
  command:string,
  parameters:Array<string|number>,
  member:Discord.GuildMember|null,
  channel:Discord.TextChannel|Discord.DMChannel|Discord.GroupDMChannel|null,
  mentions:Discord.MessageMentions|null,
}
