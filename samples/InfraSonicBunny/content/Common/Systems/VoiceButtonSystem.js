export class VoiceButtonSystem extends ModSystem {
    static PushToTalkButton = null;
    static TestConnectionButton = null;

    Load() {
        VoiceButtonSystem.PushToTalkButton = TouchButtonLoader.RegisterButton(this.Mod, 'PushToTalk');
        VoiceButtonSystem.TestConnectionButton = TouchButtonLoader.RegisterButton(this.Mod, 'TestConnection');
    }
}
