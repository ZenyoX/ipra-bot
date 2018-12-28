import { VoiceChannel, VoiceConnection, TextChannel, StreamOptions, StreamDispatcher, GuildChannel } from 'discord.js';
import Console from './Console';
import __ from './msg';
import ytDownloadCore from 'ytdl-core';
import { isUndefined } from 'lodash';
import { Readable } from 'stream';

const YOUTUBE_URL_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

interface itemList {
  title:string,
  videoURL:string,
  thumbnailURL:string,
}

export default class YouTubePlayer {

  static voiceChannel:VoiceChannel|undefined;
  static voiceConnectionBot:VoiceConnection|undefined;
  static readableStream:Readable;
  static streamDispatcher:any;
  static volumeOfPlayer:number = 0.5;
  static playList:Array<itemList> = new Array();

  private static getIsOnVoiceChannel():boolean {
    // si n'est pas undefined, cela veut dire que le bot à join un channel
    if(YouTubePlayer.voiceChannel !== undefined) {
      return true;
    }
    return false;
  }

  static async joinChannel(voiceChannel:VoiceChannel, textChannelFrom:TextChannel):Promise<string> {
    try {
      // vérification que le bot ne se trouve pas déjà dans ce channel
      if(voiceChannel.equals(YouTubePlayer.voiceChannel as GuildChannel)) {
        return __.botMusic.iAmAlreadyInThisChannel;
      } else {
        const connection = await voiceChannel.join();
        // register channel info
        YouTubePlayer.voiceChannel = voiceChannel;
        YouTubePlayer.voiceConnectionBot = connection;
      }
    } catch(error) {
      return __.botMusic.unableToConnectToThisChannel;
    }
    return(`${__.botMusic.IAmInTheChannel} ${voiceChannel.name}`);
  }

  static async leaveChannel():Promise<string> {
    try {
      if(YouTubePlayer.getIsOnVoiceChannel()) {
        if(!isUndefined(YouTubePlayer.streamDispatcher)) { YouTubePlayer.streamDispatcher.end() }
        (YouTubePlayer.voiceChannel as VoiceChannel).leave();
        const result = `${__.botMusic.ILeaveTheChannel} ${(YouTubePlayer.voiceChannel as VoiceChannel).name}`;
        YouTubePlayer.voiceChannel = undefined;
        YouTubePlayer.voiceConnectionBot = undefined;
        return result;
      } else {
        throw __.botMusic.IMustBeInAVoiceChannelToPerformThisAction;
      }
    } catch(error) {
      return error;
    }
  }

  private static async playImmediatelyThisURL(url:string):Promise<string> {
    try {
      YouTubePlayer.readableStream = ytDownloadCore(url);
      const result = await ytDownloadCore.getInfo(url);
      const title = result.title;
      // si le téléchargement de la vidéo échoue
      YouTubePlayer.readableStream.on('error', () => { throw __.botMusic.impossibleToReadThisVideo; });
      const streamOption:StreamOptions = {
        seek: 0,
        volume: YouTubePlayer.volumeOfPlayer,
        passes: 1,
        bitrate: 'auto'
      }
      YouTubePlayer.streamDispatcher = (YouTubePlayer.voiceConnectionBot as VoiceConnection).playStream(YouTubePlayer.readableStream, streamOption);
      return title;
    } catch(error) {
      return error
    }
  }

  static async play(url?:string):Promise<string> {
    try {

      // pour éviter que l'événement end à chaque nouveau play soit exécuté => suppressions de YouTubePlayer.streamDispatcher
      // pour ensuite en avoir un nouveau

      if((YouTubePlayer.streamDispatcher as StreamDispatcher) !== undefined) {
        (YouTubePlayer.streamDispatcher as StreamDispatcher).removeAllListeners();
      }

      let title = '';
      if((YouTubePlayer.voiceChannel as VoiceChannel).speakable) {
        if(YouTubePlayer.getIsOnVoiceChannel() && YouTubePlayer.voiceConnectionBot !== undefined) {
          if(url !== undefined) {
            // jouer ici une simple musique
            if(!YOUTUBE_URL_REGEX.test(url)) { throw __.botMusic.IOnlyTakeURLsThatComeFromYouTube }
            title = await YouTubePlayer.playImmediatelyThisURL(url);
          } else {
            if(!(YouTubePlayer.playList.length > 0)) {
              throw __.botMusic.FirstAddElementsToThePlayList;
            } else {
              // ici jouer la 1ere musique de la liste
              title = await YouTubePlayer.playImmediatelyThisURL(YouTubePlayer.playList[0].videoURL);
              YouTubePlayer.playList.shift();
            }
          }

          // gestion des événements de 1 flux audio
          YouTubePlayer.streamDispatcher
          .on('end', () => {
            // si musique fini + encore des elements dans la liste => passe à la prochaine
            if(YouTubePlayer.playList.length > 0) {
              YouTubePlayer.next();
            }
          })
          .on('start', () => {
            Console.log(`${__.botMusic.StartingTheMusic} ${title}`);
          });
          return `${__.botMusic.onListening} ${title}`;
        } else {
          throw __.botMusic.IMustBeInAVoiceChannelToPerformThisAction;
        }
      } else {
        throw __.botMusic.weCanNotTalkInThisChannel;
      }
    } catch(error) {
      return error;
    }
  }

  static pause():Promise<string> {
    return new Promise((resolve, reject) => {
      if(YouTubePlayer.getIsOnVoiceChannel()) {
        if(!isUndefined(YouTubePlayer.streamDispatcher)) {
          YouTubePlayer.streamDispatcher.pause();
          resolve(__.botMusic.PauseMusic);
        } else {
          reject(__.botMusic.YouMustHaveAlreadyStartedAMusicToPauseIt);
        }
      } else {
        reject(__.botMusic.IMustBeInAVoiceChannelToPerformThisAction);
      }
    });
  }

  static resume():Promise<string> {
    return new Promise((resolve, reject) => {
      if(YouTubePlayer.getIsOnVoiceChannel()) {
        if(!isUndefined(YouTubePlayer.streamDispatcher)) {
          YouTubePlayer.streamDispatcher.resume();
          resolve(__.botMusic.resumeMusic);
        } else {
          reject(__.botMusic.YouMustAlreadyHaveStoppedAMusicToResumeIt);
        }
      } else {
        reject(__.botMusic.IMustBeInAVoiceChannelToPerformThisAction);
      }
    });
  }

  static async add(url:string):Promise<string> {
    try {
      const itemList = {
        title: '',
        videoURL: '',
        thumbnailURL: '',
      }

      if(!YOUTUBE_URL_REGEX.test(url)) {
        throw `${__.botMusic.IOnlyTakeURLsThatComeFromYouTube}. ${url} ${__.botMusic.isNotValid}`;
      } else {
        // url valide
        const result = await ytDownloadCore.getInfo(url);

        itemList.videoURL = url;
        itemList.title = result.title;
        itemList.thumbnailURL = result.thumbnail_url;

        YouTubePlayer.playList.push(itemList);
        return `${itemList.title} ${__.botMusic.hasBeenAddedOnThePosition} ${YouTubePlayer.playList.length}`;
      }
    } catch(error) {
      return error;
    }
  }

  static remove(numberOfElement?:number):Promise<string> {
    return new Promise((resolve, reject) => {

      // ne peut supprimer un element que s'il y en a au moins 1 dans la play list
      if(YouTubePlayer.playList.length > 0) {
        if(numberOfElement !== undefined) {
          // un chiffre a été entré
          if(numberOfElement > YouTubePlayer.playList.length) {
            // si trop de element a supprimer alors supprimer tout
            YouTubePlayer.playList = new Array();
            resolve(__.botMusic.AllItemsInThePlayListHaveBeenDeleted);
          }
          else if(numberOfElement >= 2 && numberOfElement <= YouTubePlayer.playList.length) {
            // supprimer N elements (minimum 2) (maximum YouTubePlayer.playList.length)
            const lastIndex = YouTubePlayer.playList.length - 1;
            const numberOfElementToRemoveTab = numberOfElement - 1;
            const startIndexOfRemove = lastIndex - numberOfElementToRemoveTab;
            YouTubePlayer.playList.splice(startIndexOfRemove, numberOfElement);
            resolve(`${numberOfElement} ${__.botMusic.itemsRecentlyAddedHaveBeenDeleted}`);
          } else if(numberOfElement === 1) {
            // supprimer 1 elements
            const lastIndex = YouTubePlayer.playList.length - 1;
            resolve(`${YouTubePlayer.playList[lastIndex].title} ${__.botMusic.hasBeenDeleted}`);
            YouTubePlayer.playList.pop();
          } else {
            reject(__.botMusic.YouMustEnterGreaterThanOrEqualTo + '1');
          }
        } else {
          // supprimer 1 element
          const lastIndex = YouTubePlayer.playList.length - 1;
          resolve(`${YouTubePlayer.playList[lastIndex].title} ${__.botMusic.hasBeenDeleted}`);
          YouTubePlayer.playList.pop();
        }
      } else {
        reject(__.botMusic.ThereIsNoElementToDeleteInThePlayList);
      }

    });
  }

  static getList():Array<itemList> {
    return YouTubePlayer.playList;
  }

  static next():Promise<string> {
    return YouTubePlayer.play();
  }

  static stop():Promise<string> {
    return new Promise((resolve, reject) => {
      if(YouTubePlayer.getIsOnVoiceChannel()) {
        if(isUndefined(YouTubePlayer.streamDispatcher)) {
          reject(__.botMusic.impossibleToStopMusicThatIsNotPlaying);
        }
        // suppression de tous les elements dans la playlist
        YouTubePlayer.playList = new Array();
        (YouTubePlayer.streamDispatcher as StreamDispatcher).end();
        YouTubePlayer.streamDispatcher = undefined;
        resolve(__.botMusic.theMusicIsStopped);
      } else {
        reject(__.botMusic.IMustBeInAVoiceChannelToPerformThisAction);
      }
    });
  }

  static async changeVolume(volume:number):Promise<string> {
    try {

      // le volume de l'API est compris entre 0.0 et 1.0 (voir 2.0 pour le max)
      const volumeDiscord:number = volume / 100;

      // si 0 alors mute le bot
      if(YouTubePlayer.getIsOnVoiceChannel()) {
        if(volume > 1 && volume <= 200) {
          if(volume === 0) {
            // mute le bote
          }
          if(YouTubePlayer.streamDispatcher !== undefined) {
            YouTubePlayer.volumeOfPlayer = volumeDiscord;
            YouTubePlayer.streamDispatcher.setVolumeLogarithmic(volumeDiscord);
            return `${__.botMusic.TheVolumeIsNow} ${YouTubePlayer.volumeOfPlayer * 100}`;
          } else {
            YouTubePlayer.volumeOfPlayer = volume;
            return `${__.botMusic.TheVolumeIsNow} ${YouTubePlayer.volumeOfPlayer * 100}`;
          }
        } else {
          throw __.botMusic.TheEnteredVolumeMustBeBetween + ' 1 ⟷ 200';
        }
      } else {
        throw __.botMusic.IMustBeInAVoiceChannelToPerformThisAction;
      }

    } catch(error) {
      return error;
    }
  }
}
