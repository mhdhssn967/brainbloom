import { Howl, Howler } from 'howler'
import { SOUND_KEYS } from '@/utils/constants'

/**
 * SoundManager — singleton Howler wrapper.
 * Call SoundManager.play('correct') from anywhere.
 */
const sounds = {
  [SOUND_KEYS.CORRECT]:       "/assets/audio/correct.mp3",
  [SOUND_KEYS.WRONG]:         "/assets/audio/wrong.mp3",
  [SOUND_KEYS.STREAK]:        "/assets/audio/streak.mp3",
  [SOUND_KEYS.TICK]:          "/assets/audio/tick.mp3",
  [SOUND_KEYS.GAME_OVER]:     "/assets/audio/gameover.mp3",
  [SOUND_KEYS.WIN]:           "/assets/audio/win.mp3",
  [SOUND_KEYS.CLICK]:         "/assets/audio/click.mp3",
  [SOUND_KEYS.BALLOON_POP]:   "/assets/audio/balloon-pop.mp3",
  [SOUND_KEYS.FROG]:          "/assets/audio/frog.mp3",
  [SOUND_KEYS.SHOOT]:         "/assets/audio/shoot.mp3",
  [SOUND_KEYS.HEADSHOT]:      "/assets/audio/headshot.mp3",
  [SOUND_KEYS.ZOMBIE_DEATH]:  "/assets/audio/zombie_death.mp3",
  [SOUND_KEYS.ZOMBIE_ATTACK]: "/assets/audio/zombie_attack.mp3",
  [SOUND_KEYS.ZOMBIE_GROWL]:  "/assets/audio/zombie_growl.mp3",
}


const _cache = {}

function load(key) {
  if (_cache[key]) return _cache[key]
  _cache[key] = new Howl({ src: [sounds[key]], preload: true })
  return _cache[key]
}

const SoundManager = {
  /**
   * Play a sound by key
   * @param {string} key — one of SOUND_KEYS
   */
  play(key) {
    try { load(key).play() }
    catch (e) { console.warn(`SoundManager: could not play "${key}"`, e) }
  },

  setVolume(v) { Howler.volume(v) },

  mute(val)    { Howler.mute(val) },

  preloadAll() {
    Object.keys(sounds).forEach(load)
  },
}

export default SoundManager