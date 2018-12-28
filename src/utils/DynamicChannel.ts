// import * as Discord from 'discord.js';
// import Global from './Global';

//  export default class Channel {

//   private maxNumberCurrently: number;
//   private allChannelCreated: Array<Discord.VoiceChannel> = new Array();

//   constructor(
//   private bot:Discord.Client,
//   private categoryID:string,
//   private nameOfTheChannel:string,
//   private userLimit:number) {

//     this.maxNumberCurrently = 0;
//     setTimeout(() => {
//       this.createChannel();
//     }, 2000);
//   }

//   sortAllDynamicChannel() {
//     this.allChannelCreated.forEach(async (channel, index) => {
//       await channel.setPosition(index + 1);
//     });
//   }

//   async createChannel() {
//     if (this.bot.guilds.array()[0].available) {
//       const channelCreated = await this.bot.guilds.array()[0].createChannel(`${this.nameOfTheChannel}`,'voice') as Discord.VoiceChannel;
//       channelCreated.userLimit = this.userLimit;
//       await channelCreated.setParent(this.categoryID);
//       this.allChannelCreated.push(channelCreated);
//     } else {
//       console.log(`Attention, le serveur n'est pas disponible, ne peut pas créer un channel`);
//     }
//   }

//   removeAllChannel() {
//     if (this.allChannelCreated.length > 0) {
//       this.allChannelCreated.forEach(async (channel) => {
//         await channel.delete();
//       });
//       this.allChannelCreated = new Array();
//     }
//   }

//   onListening() {
//     this.bot.on('voiceStateUpdate', (beforeUpdateMember, afterUpdateMember) => {
//       // si join ou quitter
//       if (beforeUpdateMember.voiceChannel !== afterUpdateMember.voiceChannel) {
//         // ne peut observé que un dynamic channel
//         if(this.allChannelCreated.some(beforeUpdateMember.voiceChannel) || this.allChannelCreated.some(afterUpdateMember.voiceChannel)) {
//           // si join
//           if (afterUpdateMember.voiceChannel === this.allChannelCreated[0]) {
//             this.userJoinChannel(afterUpdateMember.voiceChannel);
//           } else {
//             this.userLeaveChannel(beforeUpdateMember.voiceChannel);
//           }
//         }
//       }
//     });
//   }

//   userJoinChannel(channel: Discord.VoiceChannel) {
//     console.log('creation channel');
//     this.createChannel();
//   }

//   userLeaveChannel(channelLeave: Discord.VoiceChannel) {
//     console.log(`channel qui vient d'être quitté => ${channelLeave.name}`);
    
//     const firstChannel = this.allChannelCreated[0];

//     console.log(`premier channel non quittable => ${firstChannel}`);
//     if (channelLeave !== firstChannel) {
//       console.log('channel qui devrait supprimé');
//       // if (channel.members.array().length === 0) {
//       //   this.allChannelCreated.forEach((channel, index) => {
//       //     if(channel === this.allChannelCreated[index]) {
//       //       this.allChannelCreated.splice(index, 1);
//       //       this.maxNumberCurrently -= 1;
//       //     }
//       //   });
//       //   channel.delete();
//       }
//     }
//   }
// }
