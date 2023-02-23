import { images, log, never, setWallpaper, sleep } from "./lib"
import Playlist from "./playlist"

export default class App {

  [Symbol.asyncIterator]() {
    return this
  }

  _intervalMinutes: number
  get intervalMinutes() {
    return this._intervalMinutes
  }
  set intervalMinutes(value: number) {
    this._intervalMinutes = value
  }

  _wallpaperDirectory: string
  get wallpaperDirectory(): string {
    return this._wallpaperDirectory
  }
  set wallpaperDirectory(value: string) {
    if (value !== this._wallpaperDirectory)
      this.wallpapers = undefined
    this._wallpaperDirectory = value
  }

  _wallpapers: string[]
  get wallpapers(): string[] {
    return this._wallpapers
  }
  set wallpapers(value: string[]) {
    this._wallpapers = value
    if (this._wallpapers)
      this.playlist.shuffle(this.wallpapers)
    else
      this.playlist.abort()
  }

  set wallpaper(value: string) {
    setWallpaper(value)
  }

  _playlist: Playlist
  get playlist(): Playlist {
    return this._playlist
  }

  async next() {
    for await (var wallPaper of this.playlist) {
      log(this.wallpaper = wallPaper)
      await sleep(this.intervalMinutes)
    }

    return {
      value: (
        this.wallpapers = this.wallpapers || await images(this.wallpaperDirectory),
        `shuffled ${this.wallpapers.length} images`
      ),
      done: never
    }
  }

}