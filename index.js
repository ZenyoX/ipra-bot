"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const chalk_1 = __importDefault(require("chalk"));
const HotModuleReload_1 = __importDefault(require("./dist/utils/HotModuleReload"));
const Global_1 = __importDefault(require("./dist/utils/Global"));
Global_1.default.bot = new Discord.Client();
Global_1.default.bot.login(process.env.token);
async function onExit() {
    console.log(chalk_1.default.yellow('\nVanityBOT s\'est correctement arrêté'));
    Global_1.default.bot.removeAllListeners();
    await Global_1.default.bot.destroy();
    process.removeAllListeners();
    process.exit();
}
process.on('exit', onExit);
process.on('SIGINT', onExit);
process.on('SIGUSR1', onExit);
process.on('SIGUSR2', onExit);
process.on('uncaughtException', onExit);
Global_1.default.hotModuleReload = new HotModuleReload_1.default(__dirname + '/app', __dirname);
Global_1.default.hotModuleReload.beforeReloading(() => {
    Global_1.default.bot.removeAllListeners();
});
//# sourceMappingURL=index.js.map