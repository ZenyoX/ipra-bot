// vscode-fold=#
import YouTubePlayer from './YouTubePlayer';
import { VoiceChannel, GuildMember, TextChannel } from 'discord.js';
import Message from './Message';
import { isString } from 'lodash';
import { formatedCommand } from '../typings/Global.d';
import __ from './msg';

export default class MusicHandler {

  private static MESSAGE_DURATION = 6000;

  static triggerCommand(cmd:formatedCommand):void {
    switch(cmd.command) {
      case 'join':
        MusicHandler.join((cmd.member as GuildMember).voiceChannel as VoiceChannel, cmd.channel as TextChannel);
        break;
      case 'leave':
        MusicHandler.leave(cmd.channel as TextChannel);
        break;
      case 'play':
        MusicHandler.play((cmd.member as GuildMember).voiceChannel as VoiceChannel, cmd.channel as TextChannel, cmd.parameters[0] as string);
        break;
      case 'pause':
        MusicHandler.pause(cmd.channel as TextChannel);
        break;
      case 'resume':
        MusicHandler.resume(cmd.channel as TextChannel);
        break;
      case 'list':
        MusicHandler.list(cmd.channel as TextChannel);
        break;
      case 'add':
        MusicHandler.add(cmd.channel as TextChannel, cmd.parameters);
        break;
      case 'remove':
        MusicHandler.remove(cmd.channel as TextChannel, cmd.parameters[0] as number);
        break;
      case 'next':
        MusicHandler.next((cmd.member as GuildMember).voiceChannel as VoiceChannel, cmd.channel as TextChannel);
        break;
      case 'stop':
        MusicHandler.stop(cmd.channel as TextChannel);
        break;
      case 'volume':
        MusicHandler.volume(cmd.channel as TextChannel, cmd.parameters[0] as number);
        break;
      default:
        break;
    }
  }

  static join(channel:VoiceChannel, textChannelFrom:TextChannel):void {
    YouTubePlayer.joinChannel(channel, textChannelFrom)
      .then((message) => {
        Message.send(textChannelFrom, message, MusicHandler.MESSAGE_DURATION);
      })
      .catch((error) => Message.send(textChannelFrom, error, MusicHandler.MESSAGE_DURATION));
  }

  static leave(TextChannel:TextChannel):void {
    YouTubePlayer.leaveChannel()
    .then((result) => Message.send(TextChannel, result, MusicHandler.MESSAGE_DURATION))
    .catch((error) => Message.send(TextChannel, error, MusicHandler.MESSAGE_DURATION));
  }

  static play(channel:VoiceChannel, textChannelFrom:TextChannel, url:string):void {
    YouTubePlayer.joinChannel(channel, textChannelFrom)
    .then(() => {
      YouTubePlayer.play(url)
        .then((result) => Message.send(textChannelFrom, result, MusicHandler.MESSAGE_DURATION))
        .catch(error => Message.send(textChannelFrom, error, MusicHandler.MESSAGE_DURATION));
    })
    .catch();
  }

  static pause(TextChannel:TextChannel):void {
    YouTubePlayer.pause()
      .then((result) => Message.send(TextChannel, result, MusicHandler.MESSAGE_DURATION))
      .catch((error) => Message.send(TextChannel, error, MusicHandler.MESSAGE_DURATION));
  }

  static resume(TextChannel:TextChannel):void {
    YouTubePlayer.resume()
      .then((result) => Message.send(TextChannel, result, MusicHandler.MESSAGE_DURATION))
      .catch((error) => Message.send(TextChannel, error, MusicHandler.MESSAGE_DURATION));
  }

  static list(TextChannel:TextChannel):void {
    const list = YouTubePlayer.getList();
    if(list.length > 0) {
      let displayedList = '';
      list.forEach((element, index) => {
        displayedList += `${index + 1}\t>>\t${element.title}\n`;
      });
      Message.sendMarkdown(TextChannel, displayedList, MusicHandler.MESSAGE_DURATION);
    } else {
      Message.send(TextChannel, __.botMusic.ThereIsNoMusicInThePlaylist, MusicHandler.MESSAGE_DURATION);
    }
  }

  static add(TextChannel:TextChannel, urls:Array<string|number>):void {
    urls.forEach(async (url) => {
      if(isString(url)) {
        await YouTubePlayer.add(url)
          .then((result) => Message.sendMarkdown(TextChannel, result, MusicHandler.MESSAGE_DURATION))
          .catch((error) => Message.send(TextChannel, error, MusicHandler.MESSAGE_DURATION));
      } else {
        Message.send(TextChannel, __.botMusic.YouMustEnterAYouTubeURL, MusicHandler.MESSAGE_DURATION);
      }
    });
  }

  static remove(TextChannel:TextChannel, numberOfElementToDelete:number):void {
    YouTubePlayer.remove(numberOfElementToDelete)
      .then((result) => Message.send(TextChannel, result, MusicHandler.MESSAGE_DURATION))
      .catch((error) => Message.send(TextChannel, error, MusicHandler.MESSAGE_DURATION));
  }

  static next(channel:VoiceChannel, textChannelFrom:TextChannel):void {
      YouTubePlayer.joinChannel(channel, textChannelFrom)
      .then((message) => {
        YouTubePlayer.next()
        .then((result) => Message.send(textChannelFrom, result, MusicHandler.MESSAGE_DURATION))
        .catch((error) => Message.send(textChannelFrom, error, MusicHandler.MESSAGE_DURATION));
      })
      .catch((error) => Message.send(textChannelFrom, error, MusicHandler.MESSAGE_DURATION));
  }

  static stop(TextChannel:TextChannel):void {
    YouTubePlayer.stop()
      .then((result) => Message.send(TextChannel, result, MusicHandler.MESSAGE_DURATION))
      .catch((error) => Message.send(TextChannel, error, MusicHandler.MESSAGE_DURATION));
  }

  static volume(TextChannel:TextChannel, volume:number):void {
    YouTubePlayer.changeVolume(volume)
      .then((result) => Message.send(TextChannel, result, MusicHandler.MESSAGE_DURATION))
      .catch((error) => Message.send(TextChannel, error, MusicHandler.MESSAGE_DURATION));
  }
}
