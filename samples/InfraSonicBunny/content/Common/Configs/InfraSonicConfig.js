import { VoiceTransport } from '../Net/VoiceTransport.js';

export class InfraSonicConfig extends ModConfig {
    static Options = {
        ConnectionHeader: ModConfig.Header(),
        VoiceChannel: ModConfig.Cycle('0', ['0', '1', '2', '3', '4', '5', '6', '7']),
        TestConnection: ModConfig.Button('RunConnectionTest'),
        AudioHeader: ModConfig.Header(),
        ProximityDistance: ModConfig.Range(64, { min: 0, max: 192, step: 16, suffix: ' tiles', enabledWhen: () => false }),
        PushToTalk: ModConfig.Toggle(true, { enabledWhen: () => false }),
        MicrophoneEnabled: ModConfig.Toggle(false, { enabledWhen: () => false }),
        NoiseSuppression: ModConfig.Toggle(false, { enabledWhen: () => false }),
        Amplification: ModConfig.Range(1, { min: 0.5, max: 2, step: 0.1, suffix: 'x', enabledWhen: () => false }),
        BackgroundMusicDucking: ModConfig.Toggle(true, { enabledWhen: () => false }),
        SpeakingIcons: ModConfig.Toggle(true, { enabledWhen: () => false })
    };

    OnLoaded() {
        VoiceTransport.SetChannel(this.VoiceChannel);
    }

    OnChanged(key) {
        if (key === 'VoiceChannel') VoiceTransport.SetChannel(this.VoiceChannel);
    }

    RunConnectionTest() {
        VoiceTransport.SendProbe(this.VoiceChannel);
    }
}
