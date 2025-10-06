# Sound Effects for Memory Card Game

This directory contains all the sound effects and background music for the game.

## Required Sound Files

The game expects the following sound files (all in MP3 format):

### Core Game Sounds

1. **card-flip.mp3** - Played when a card is flipped
   - Duration: ~0.2-0.3 seconds
   - Suggested: Light swoosh or flip sound
   
2. **card-match.mp3** - Played when two cards match
   - Duration: ~0.5-1 second
   - Suggested: Positive chime, bell, or "success" sound
   
3. **card-mismatch.mp3** - Played when two cards don't match
   - Duration: ~0.3-0.5 seconds
   - Suggested: Subtle "wrong" tone or click

### UI Sounds

4. **button-click.mp3** - Played when buttons are clicked
   - Duration: ~0.1-0.2 seconds
   - Suggested: Soft click or tap sound
   
5. **difficulty-select.mp3** - Played when selecting difficulty
   - Duration: ~0.3-0.5 seconds
   - Suggested: Menu selection sound

### Achievement & Progress Sounds

6. **achievement.mp3** - Played when unlocking an achievement
   - Duration: ~1-2 seconds
   - Suggested: Fanfare, celebration sound, or triumphant tune
   
7. **level-unlock.mp3** - Played when a new difficulty level is unlocked
   - Duration: ~1-1.5 seconds
   - Suggested: Unlock chime or level-up sound
   
8. **game-complete.mp3** - Played when completing a game
   - Duration: ~2-3 seconds
   - Suggested: Victory fanfare or completion jingle

### Background Music

9. **background-music.mp3** - Looping background music (optional)
   - Duration: 1-3 minutes (will loop)
   - Suggested: Calm, non-intrusive instrumental music
   - Note: Disabled by default, players can enable in settings

## Finding Free Sound Effects

### Recommended Sources (Free/Open Source)

1. **[Freesound.org](https://freesound.org/)** - Large library of Creative Commons sounds
2. **[OpenGameArt.org](https://opengameart.org/)** - Game-specific sound effects
3. **[Zapsplat.com](https://zapsplat.com/)** - Free sound effects (attribution required)
4. **[Mixkit.co](https://mixkit.co/free-sound-effects/)** - High quality free sounds
5. **[BBC Sound Effects](https://sound-effects.bbcrewind.co.uk/)** - Free for personal use

### Quick Start Collections

For a cohesive sound pack, search for:
- "UI sound pack"
- "Game menu sounds"
- "Card game sounds"
- "Casual game sound effects"

## Audio Specifications

- **Format**: MP3 (widely supported, good compression)
- **Sample Rate**: 44.1kHz or 48kHz
- **Bit Rate**: 128kbps or higher
- **Channels**: Mono or Stereo (mono recommended for smaller file sizes)

## Volume Guidelines

The game automatically adjusts volumes:
- Card flip: 30% base volume
- Match: 40% base volume
- Mismatch: 30% base volume
- Button click: 20% base volume
- Difficulty select: 30% base volume
- Achievement: 60% base volume
- Level unlock: 50% base volume
- Game complete: 50% base volume
- Background music: 30% base volume

Users can further adjust volumes in the audio settings panel.

## Testing Your Sounds

1. Place sound files in this directory
2. Start the development server: `npm run dev`
3. Open the game and click the audio settings button (speaker icon)
4. Enable sounds and test by playing the game
5. Adjust individual volumes as needed

## Creating Silent Placeholders (For Testing)

If you don't have sounds yet but want to test the system:

```bash
# Create 100ms silent MP3 files (requires ffmpeg)
for file in card-flip card-match card-mismatch button-click difficulty-select achievement level-unlock game-complete background-music; do
  ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 0.1 -q:a 9 -acodec libmp3lame "${file}.mp3"
done
```

## License & Attribution

Ensure any sounds you use comply with their respective licenses:
- ✅ Public Domain (CC0)
- ✅ Creative Commons Attribution
- ⚠️ Check commercial use permissions
- ⚠️ Provide attribution where required

Add attribution in your project's LICENSE or CREDITS file if needed.

## Performance Notes

- Total size of all sounds should ideally be under 1MB
- Sounds are lazy-loaded when the game starts
- Missing sounds will fail silently (won't break the game)
- Consider compressing large files to reduce loading time

---

**Need help?** Check the [project documentation](../../README.md) or open an issue on GitHub.
