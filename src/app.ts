import { exec } from "child_process"
import Playlist from "./playlist"

export default class App {

  [Symbol.asyncIterator]() {
    return this
  }

  private _intervalMinutes: number
  get intervalMinutes() {
    return this._intervalMinutes
  }
  set intervalMinutes(value: number) {
    this._intervalMinutes = value
  }

  private _wallpaperDirectory: string
  get wallpaperDirectory(): string {
    return this._wallpaperDirectory
  }
  set wallpaperDirectory(value: string) {
    if (this._wallpaperDirectory && value !== this._wallpaperDirectory) {
      this.wallpapers = undefined
      this._wallpaperDirectory = value
      this.shuffle()
    }
    this._wallpaperDirectory = value
  }

  _wallpapers: string[]
  get wallpapers(): string[] {
    return this._wallpapers
  }
  set wallpapers(value: string[]) {
    this._wallpapers = value
  }

  set wallpaper(value: string) {
    console.log(`${new Date().toISOString()} changing wallpaper to: ${value}`)
    this.execute(`gsettings set org.gnome.desktop.background picture-uri file:///${value}`)
  }

  _playlist: Playlist
  get playlist(): Playlist {
    return this._playlist
  }

  execute = async (command: string) => await new Promise(resolve => exec(command, resolve))

  shuffle() {
    return this.playlist.shuffle(this.wallpapers)
  }

  async next() {
    for await (var wallPaper of this.playlist) {
      this.wallpaper = wallPaper
      await sleep(this.intervalMinutes)
    }
    return {
      value: this.shuffle(),
      done: false // run forever
    }
  }

}

export const sleep = async (minutes: number) => await new Promise(resolve => setTimeout(resolve, minutes * 60 * 1000))