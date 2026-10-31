import { VoiceButtonSystem } from '../Systems/VoiceButtonSystem.js';
import { VoiceTransport } from '../Net/VoiceTransport.js';

export class VoiceControlPlayer extends ModPlayer {
    OnEnterWorld(player) {
        if (player.whoAmI === Terraria.Main.myPlayer) VoiceTransport.ResetSession();
    }

    ProcessTriggers(player, triggersSet) {
        if (player.whoAmI !== Terraria.Main.myPlayer) return;
        const test = VoiceButtonSystem.TestConnectionButton;
        if (test && test.JustPressed) VoiceTransport.SendProbe();
        const ptt = VoiceButtonSystem.PushToTalkButton;
        if (ptt && ptt.JustPressed) VoiceTransport.ShowMicrophoneNotice();
    }
}
