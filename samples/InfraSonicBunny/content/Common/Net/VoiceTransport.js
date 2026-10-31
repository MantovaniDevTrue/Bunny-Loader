const ShowText = Terraria.Main['void NewText(string newText, byte R, byte G, byte B, bool onlyCurrentPlayer)'];

export class VoiceTransport {
    static Mod = null;
    static LastMicrophoneNotice = -10000;
    static LastProbeTick = -10000;
    static Probe = 1;
    static Acknowledgement = 2;
    static PeerProbe = 3;
    static Protocol = 1;
    static CurrentChannel = 0;

    static Attach(mod) {
        this.Mod = mod;
    }

    static SetChannel(value) {
        const channel = Number(value);
        if (Number.isInteger(channel) && channel >= 0 && channel <= 7) this.CurrentChannel = channel;
    }

    static Channel() {
        return this.CurrentChannel;
    }

    static ResetSession() {
        this.LastMicrophoneNotice = -10000;
        this.LastProbeTick = -10000;
    }

    static Notify(key, replacements = {}) {
        let message = ModLocalization.Translate('CustomText.' + key);
        for (const [name, value] of Object.entries(replacements))
            message = message.replace('{' + name + '}', String(value));
        ShowText('[InfraSonic] ' + message, 130, 233, 229, false);
    }

    static Tick() {
        return Number(Terraria.Main.GameUpdateCount) || 0;
    }

    static ShowMicrophoneNotice() {
        const tick = this.Tick();
        if (tick - this.LastMicrophoneNotice < 120) return;
        this.LastMicrophoneNotice = tick;
        this.Notify('MicrophoneUnavailable');
    }

    static SendProbe(selectedChannel) {
        const mode = Terraria.Main.netMode;
        if (mode === 0) {
            this.Notify('MultiplayerRequired');
            return;
        }
        if (mode !== 1) {
            this.Notify('ClientRequired');
            return;
        }
        const tick = this.Tick();
        if (tick - this.LastProbeTick < 120) return;
        this.LastProbeTick = tick;
        const channel = Number(selectedChannel ?? this.Channel());
        if (!Number.isInteger(channel) || channel < 0 || channel > 7) return;

        const packet = this.Mod.GetPacket();
        packet.WriteByte(this.Probe);
        packet.WriteByte(this.Protocol);
        packet.WriteByte(channel);
        packet.Send();
        this.Notify('ProbeSent', { Channel: channel });
    }

    static HandlePacket(reader, whoAmI) {
        if (!reader.HasMore) return;
        const type = reader.ReadByte();
        if (!reader.HasMore) return;
        const protocol = reader.ReadByte();
        if (protocol !== this.Protocol) return;
        const mode = Terraria.Main.netMode;

        if (mode & 2) {
            if (type !== this.Probe || whoAmI < 0 || whoAmI >= 255 || !reader.HasMore) return;
            const channel = reader.ReadByte();
            if (!Number.isInteger(channel) || channel < 0 || channel > 7) return;

            const ack = this.Mod.GetPacket();
            ack.WriteByte(this.Acknowledgement);
            ack.WriteByte(this.Protocol);
            ack.WriteByte(channel);
            ack.Send(whoAmI);

            const relay = this.Mod.GetPacket();
            relay.WriteByte(this.PeerProbe);
            relay.WriteByte(this.Protocol);
            relay.WriteByte(channel);
            relay.WriteByte(whoAmI);
            relay.Send(-1, whoAmI);
            return;
        }

        if (mode !== 1 || whoAmI !== 256 || !reader.HasMore) return;
        const channel = reader.ReadByte();
        if (channel !== this.Channel()) return;

        if (type === this.Acknowledgement) {
            this.Notify('ServerAcknowledged', { Channel: channel });
        } else if (type === this.PeerProbe && reader.HasMore) {
            const playerIndex = reader.ReadByte();
            if (playerIndex < 0 || playerIndex >= Terraria.Main.maxPlayers) return;
            const player = Terraria.Main.player[playerIndex];
            if (player && player.active) this.Notify('PeerProbed', { Player: player.name });
        }
    }
}
