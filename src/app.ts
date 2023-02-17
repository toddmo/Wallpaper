import { exec } from "child_process"
import { watch } from "fs"
import { opendir } from "fs/promises"
import { basename, extname, join } from "path"
import Playlist from "./playlist"

export default class WallpaperChanger {

  //#region Public Properties
  private sleep = async () => await new Promise(resolve => setTimeout(resolve, this.intervalMinutes * 60 * 1000))
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
    this._wallpaperDirectory = value
    watch(this.wallpaperDirectory, (eventType, filename) => {
      this.setWallPapers(undefined)
    })
  }
  //#endregion

  //#region Private Properties
  private reconfig = async () => this.config = await this.config
  private _configFile = '../config.json'
  private get config(): any {
    return (async () => {
      delete require.cache[require.resolve(this._configFile)]
      return await import(this._configFile)
    })()
  }
  private set config(value: any) {
    Object.assign(this, value)
    watch(join(__dirname, this._configFile), (eventType: string, filename: string) => this.reconfig())
  }

  private _playlist: Playlist
  private get playlist(): Playlist {
    if (!this._playlist)
      this._playlist = new Playlist()
    return this._playlist
  }

  private _wallpapers: string[]
  private async getWallPapers(): Promise<string[]> {
    if (!this._wallpapers) {
      var directoryFiles: any[] = []
      var dir = await opendir(this.wallpaperDirectory)
      for await (const dirent of dir)
        directoryFiles.push({
          name: dirent.name,
          path: join(this.wallpaperDirectory, dirent.name),
          base: basename(dirent.name, extname(dirent.name)),
          extension: extname(dirent.name).substring(1),
        })
      this._wallpapers = directoryFiles
        .filter((o: any) => ['png', 'jpg'].includes(o.extension.toLowerCase()))
        .map((o: any) => o.path)
    }
    return this._wallpapers
  }
  private setWallPapers(value: string[]) {
    this._wallpapers = value
  }

  private execute = async (command: string) => await new Promise(resolve => exec(command, resolve))
  private async getWallpaper(): Promise<string> {
    var playlist = await this.playlist.getItems()
    var playlistIndex = await this.playlist.getIndex()
    return playlist[playlistIndex]
  }
  private async setWallpaper(value: string) {
    // sudo apt - get install flatpak
    // flatpak remote - add--if-not - exists flathub https://flathub.org/repo/flathub.flatpakrepo
    // sudo flatpak install flathub org.gabmus.hydrapaper
    // run the GUI flatpak run org.gabmus.hydrapaper or use the CLI hydrapaper - c path_to_wallpaper1 path_to_wallpaper2 ...
    var command: string = `gsettings set org.gnome.desktop.background picture-uri file:///${value}`
    console.log(`${new Date().toISOString()} changing wallpaper to: ${value}`)
    var result = await this.execute(command)
    return result
  }
  //#endregion

  //#region Private Methods
  private async update() {
    var paper = await this.getWallpaper()
    var result = await this.setWallpaper(paper)
    return paper
  }

  private async next(): Promise<boolean> {
    var index = await this.playlist.advance()
    var wallpaper = await this.getWallpaper()
    return wallpaper !== undefined
  }

  private async play() {
    while (await this.next()) {
      await this.update()
      await this.sleep()
    }
  }
  //#endregion

  //#region Public Methods
  async run() {
    await this.reconfig()

    while (true) {
      await this.play()
      await this.playlist.setItems(this.playlist.create(await this.getWallPapers()))
    }
  }
  //#endregion

}



new WallpaperChanger().run()