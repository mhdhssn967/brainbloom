/**
 * TimerEngine — pure countdown timer with callbacks.
 * No React dependency. Wrap with useTimer hook for components.
 */
export class TimerEngine {
  constructor({ duration, onTick, onComplete }) {
    this.duration   = duration
    this.remaining  = duration
    this.onTick     = onTick     || (() => {})
    this.onComplete = onComplete || (() => {})
    this._interval  = null
    this._running   = false
  }

  start() {
    if (this._running) return
    this._running  = true
    this._interval = setInterval(() => {
      this.remaining--
      this.onTick(this.remaining)
      if (this.remaining <= 0) {
        this.stop()
        this.onComplete()
      }
    }, 1000)
    return this
  }

  pause() {
    clearInterval(this._interval)
    this._running = false
    return this
  }

  resume() {
    if (!this._running && this.remaining > 0) this.start()
    return this
  }

  stop() {
    clearInterval(this._interval)
    this._running = false
    return this
  }

  reset(newDuration) {
    this.stop()
    this.remaining = newDuration ?? this.duration
    return this
  }

  getProgress() {
    return this.remaining / this.duration   // 1.0 → 0.0
  }

  isRunning() { return this._running }
}