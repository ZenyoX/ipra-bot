import { GroupDMChannel, TextChannel, DMChannel, Message as DiscordMessage, RichEmbed, GuildAuditLogs} from 'discord.js';
import { isFinite } from 'lodash';

type channelMessage = GroupDMChannel|TextChannel|DMChannel;
interface MessageHooked {
  guid:string,
  isAlwaysLastMessage:boolean,
  message:DiscordMessage,
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export default class Message {

  static defaultColorEmbed:string = '#3498DB';
  static messageRegistered:Array<MessageHooked> = new Array();

  static async send(channel:channelMessage, message:string, deleteTime?:number) {
    const richEmbed = new RichEmbed();
    richEmbed.setColor(Message.defaultColorEmbed);
    richEmbed.setDescription(message);
    // richEmbed.setThumbnail('https://cdn-images-1.medium.com/max/2000/1*EE4IrlniNAhubIUrFqV3FQ.jpeg');
    const messageDespatched = await channel.send('', richEmbed);
    // instanceof vérifie qu'il ne s'agit pas d'un retour Array<DiscordMessage>
    if(isFinite(deleteTime) && messageDespatched instanceof DiscordMessage) {
      messageDespatched.delete(deleteTime).then().catch(error => console.error(error));
    } else if (isFinite(deleteTime) && messageDespatched instanceof Array) {
      messageDespatched.forEach((element) => {
        element.delete(deleteTime).then().catch(error => console.error(error));
      });
    }
  }

  static async sendImage(channel:channelMessage, title:string, color:string, url:string) {
    const richEmbed = new RichEmbed();
    richEmbed.setColor(color);
    richEmbed.setImage(url);
    richEmbed.setAuthor(title);
    await channel.send('', richEmbed);
  }

  static async sendMarkdown(channel:channelMessage, message:string, deleteTime?:number) {
    message = '```' + message + '```';
    const messageDespatched = await channel.send(message);
    // instanceof vérifie qu'il ne s'agit pas d'un retour Array<DiscordMessage>
    if(isFinite(deleteTime) && messageDespatched instanceof DiscordMessage) {
      messageDespatched.delete(deleteTime).then().catch(error => console.error(error));
    } else if (isFinite(deleteTime) && messageDespatched instanceof Array) {
      messageDespatched.forEach((element) => {
        element.delete(deleteTime).then().catch(error => console.error(error));
      });
    }
  }

  static findedNewMessage(channel:channelMessage):void {
    // message à supprimer (pour le recrée plus bas) se trouve dans le channel
    const messageFounded = Message.messageRegistered.filter((element) => element.message.channel === channel)[0];
    if(messageFounded !== undefined) {
      const copyMessage:DiscordMessage = messageFounded.message;
      messageFounded.message.delete();
      // Message.send
    }
  }

  static async sendHookNotification(channel:channelMessage, message:string, isAlwaysLastMessage?:boolean, urlThumbnail?:string, timeToLive?:number):Promise<string> {
    try {
      const richEmbed = new RichEmbed();
      richEmbed.setColor(Message.defaultColorEmbed);
      richEmbed.setDescription(message);
      if(urlThumbnail !== undefined) { richEmbed.setThumbnail(urlThumbnail); }
      if(timeToLive === undefined) { timeToLive = 259200; }
      if(isAlwaysLastMessage === undefined) { isAlwaysLastMessage = false }


      const messageDespatched = await channel.send('', richEmbed);


      // instanceof vérifie qu'il ne s'agit pas d'un retour Array<DiscordMessage>
      if(isFinite(timeToLive) && messageDespatched instanceof DiscordMessage) {


        const GUID = guid();
        Message.messageRegistered.push({
          guid: GUID,
          isAlwaysLastMessage:true,
          message: messageDespatched,
        });
        messageDespatched.delete(timeToLive);
        return GUID;


      } else if (isFinite(timeToLive) && messageDespatched instanceof Array) {


        const GUID = guid();
        Message.messageRegistered.push({
          guid: guid(),
          isAlwaysLastMessage,
          message: messageDespatched[0],
        });
        messageDespatched.forEach(async (element) => {
          element.delete(timeToLive);
        });
        return GUID;

      }
      return (messageDespatched as DiscordMessage).id;
    } catch(error) {
      return error;
    }

  }

  static async modifyHookNotification(guid:string, messageOverride:string, urlThumbnail?:string):Promise<string> {
    try {


      const findedMessage = Message.messageRegistered.filter((element) => element.guid === guid)[0];
      if(findedMessage === undefined) { throw 'Aucun message trouver à modifier'; }

      const richEmbed = new RichEmbed();
      richEmbed.setColor(Message.defaultColorEmbed);
      richEmbed.setDescription(messageOverride);
      if(urlThumbnail !== undefined) { richEmbed.setThumbnail(urlThumbnail); }

      findedMessage.message.edit('', richEmbed);
      return 'Message modifier';


    } catch(error) {
      return error;
    }
  }

  static async removeHookNotification(guid:string):Promise<string> {
    try {
      const findedMessage = Message.messageRegistered.filter((element) => element.guid === guid)[0];
      if(findedMessage === undefined) {
        throw 'Aucun message trouver à modifier';
      }
      findedMessage.message.delete();
      return `Message supprimer ${guid}`;
    } catch(error) {
      return error;
    }
  }
}
