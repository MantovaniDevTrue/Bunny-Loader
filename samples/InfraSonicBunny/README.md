# InfraSonic — Bunny Loader port (draft)

This is the initial, **non-audio** integration for bringing [InfraSonic 2.1.2](https://github.com/terraria-catalyst/infrasonic-mod) to Terraria Android / Bunny Loader.

Original mod by **Oli, Cyrilly and 轩天一夏**. Bunny Loader port by **Mantovani**. The original project is licensed under **AGPL-3.0**; preserve its attribution and license when redistributing its code or assets.

## What works in the source

- Bunny Loader `Mod`, `ModConfig`, `ModSystem`, and `ModPlayer`, following the project's ExampleMod API.
- PT-BR / EN localization, eight diagnostic channel selections, two configurable touch actions.
- Versioned `ModPacket` handshake: client probe, server acknowledgement, server relay, client-side channel filtering. It carries **no voice data**.
- Unimplemented audio options are intentionally disabled and Push-to-Talk only reports that microphone support is missing.

This source-only sample does **not** include the upstream binary UI assets; the separately packaged prototype contains them. The absent touch-button textures use Bunny Loader's fallback icons. No upstream Terraria or tModLoader runtime code is included.

## Test

1. Install the sample with Bunny Loader enabled on a host/server and clients.
2. Join from a separate client and use **Test connection** in the mod settings or the editable touch controls.
3. A returned server acknowledgement confirms the diagnostic round trip. A second player may observe the relay.
4. PTT reports the unavailable microphone; no audio should be expected.

## Native support needed before this becomes voice chat

- Android runtime `RECORD_AUDIO` permission and an explicit user-controlled microphone lifecycle, including pause/background/unload.
- Low-latency mono PCM capture/playback with `AudioRecord` and `AudioTrack`, ideally 48 kHz, 20 ms frames.
- Opus codec and (optionally) RNNoise for ARM64, with bounded queues and zero per-frame game-thread JNI or JS polling.
- A **binary** voice transport independent of `ModPacket`'s JSON format: authenticated peer/session identity, bounded frame sizes, rate limits, channels and server relay.
- Positional attenuation, stereo pan, speaking indicators, volume controls, voice mute, and music ducking from the original mod.
- Real two-device Android multiplayer and performance tests, including mute/permissions/background/crash cases.

**Current status:** JavaScript protocol model checked locally; no on-device runtime or voice-stream tests yet. This PR is a request for review and direction on the native audio boundary, not a claim of a finished InfraSonic port.
