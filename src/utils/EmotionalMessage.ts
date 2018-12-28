import { formatedCommand } from '../typings/Global';
import { hugImg } from '../assets/config/imageURLS';
import { slapImg } from '../assets/config/imageURLS';
import { tapImg } from '../assets/config/imageURLS';
import { MessageMentions, TextChannel, GuildMember } from 'discord.js';
import Message from './Message';
import __ from './msg';

export default class EmotionalMessage {

  static sendHug(authorMember:GuildMember, targetMembers:MessageMentions, channel:TextChannel) {
    const memberMentioned = targetMembers.members.array();
    // s'il y a au moins 1 membre mentionné
    if(memberMentioned.length > 0) {
      memberMentioned.forEach((member) => {
        const messageToSend = `${authorMember.displayName} ${__.EmotionalMessage.Hug} ${member.displayName}`;
        Message.sendImage(channel, messageToSend, '#FFC0CB', hugImg.liens[Math.floor((Math.random() * hugImg.liens.length))]);
      });
    } else {
      Message.send(channel, __.EmotionalMessage.YouMustMention1PersonToUse, 4500);
    }
  }
  static sendSlap(authorMember:GuildMember, targetMembers:MessageMentions, channel:TextChannel) {
    const memberMentioned = targetMembers.members.array();
    // s'il y a au moins 1 membre mentionné
    if(memberMentioned.length > 0) {
      memberMentioned.forEach((member) => {
        const messageToSend = `${authorMember.displayName} ${__.EmotionalMessage.Slap} ${member.displayName}`;
        Message.sendImage(channel, messageToSend, '#D21212', slapImg.liens[Math.floor((Math.random() * slapImg.liens.length))]);
      });
    } else {
      Message.send(channel, __.EmotionalMessage.YouMustMention1PersonToUse, 4500);
    }
  }
  static sendTap(authorMember:GuildMember, targetMembers:MessageMentions, channel:TextChannel) {
    const memberMentioned = targetMembers.members.array();
    // s'il y a au moins 1 membre mentionné
    if(memberMentioned.length > 0) {
      memberMentioned.forEach((member) => {
        const messageToSend = `${authorMember.displayName} ${__.EmotionalMessage.Tap} ${member.displayName}`;
        Message.sendImage(channel, messageToSend, '#FFC0CB', tapImg.liens[Math.floor((Math.random() * tapImg.liens.length))]);
      });
    } else {
      Message.send(channel, __.EmotionalMessage.YouMustMention1PersonToUse, 4500);
    }
  }

  static triggerCommand(cmd:formatedCommand):void {
    switch(cmd.command) {
      case 'hug':
        EmotionalMessage.sendHug(cmd.member as GuildMember, cmd.mentions as MessageMentions, cmd.channel as TextChannel);
        break;
        case 'slap':
        EmotionalMessage.sendSlap(cmd.member as GuildMember, cmd.mentions as MessageMentions, cmd.channel as TextChannel);
        break;
        case 'tap':
        EmotionalMessage.sendTap(cmd.member as GuildMember, cmd.mentions as MessageMentions, cmd.channel as TextChannel);
        break;
      default:
        break;
    }
  }
}
