import { VoiceTransport } from './Common/Net/VoiceTransport.js';

export default class InfraSonic extends Mod {
    Load() {
        VoiceTransport.Attach(this);
    }

    HandlePacket(reader, whoAmI) {
        VoiceTransport.HandlePacket(reader, whoAmI);
    }
}
