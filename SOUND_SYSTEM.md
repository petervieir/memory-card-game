# Sound System

Dynamic sound effects and optional background music.

## Features

- **Sound Effects**: Card flips, matches, achievements, etc.
- **Background Music**: Optional looping music
- **Volume Controls**: Independent sliders (0-100%)
- **Persistent Settings**: Saved per browser
- **Graceful Degradation**: Works without sound files

## Sound Events

| Event | Sound |
|-------|-------|
| Card Click | `card_flip` |
| Match | `card_match` |
| Mismatch | `card_mismatch` |
| Game Complete | `game_complete` |
| Achievement | `achievement_unlock` |
| Level Unlock | `level_unlock` |
| Button Click | `button_click` |

## UI

- Audio settings panel (speaker icon)
- Toggle sound effects on/off
- Toggle background music on/off
- Real-time volume adjustment

## Setup

Place MP3 files in `front-end/public/sounds/`:
- `card_flip.mp3`
- `card_match.mp3`
- `card_mismatch.mp3`
- `game_complete.mp3`
- `achievement_unlock.mp3`
- `level_unlock.mp3`
- `button_click.mp3`
- `background_music.mp3`

Game works perfectly without sound files.
