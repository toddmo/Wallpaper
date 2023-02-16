import { exec } from "child_process"
import { watch, existsSync } from "fs"
import { opendir, readFile, writeFile } from "fs/promises"
import { basename, extname, join } from "path"

export default class WallpaperChanger {

  //#region Public Properties
  private _intervalMinutes
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
  }
  //#endregion

  //#region Private Properties
  private _wallpapers: string[]
  private get wallPapers(): Promise<string[]> {
    return (async () => {
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
    })()
  }
  private set wallPapers(value: Promise<string[]>) {
    (async () => {
      this._wallpapers = await value
    })()
  }

  private _playlistIndexFile: string = join(__dirname, '../playlistIndex.txt')
  private get playlistIndexFile(): string {
    return this._playlistIndexFile
  }

  private _playlistIndex: number
  private get playlistIndex(): Promise<number> {
    return (async () => {
      if (this._playlistIndex === undefined || Number.isNaN(this._playlistIndex))
        if (await existsSync(this.playlistIndexFile))
          this._playlistIndex = parseInt((await readFile(this.playlistIndexFile)).toString()) || 0
        else
          this._playlistIndex = 0
      return this._playlistIndex
    })()
  }
  private set playlistIndex(value: Promise<number>) {
    (async () => {
      this._playlistIndex = await value
      await writeFile(this.playlistIndexFile, this._playlistIndex.toString()) // survive restart
    })()
  }

  private get wallpaper(): Promise<string> {
    return (async () => {
      var playlist = await this.playlist
      var playlistIndex = await this.playlistIndex
      return playlist[playlistIndex]
    })()
  }
  private set wallpaper(value: Promise<string>) {
    (async () => {
      var file: string = await value
      var command: string = `gsettings set org.gnome.desktop.background picture-uri file:///${file}`
      console.log(`${new Date().toISOString()} changing wallpaper to: ${file}`)
      exec(command)
    })()
  }

  private _playlistPath: string = join(__dirname, '../playlist.txt')
  private get playlistPath(): string {
    return this._playlistPath
  }

  private _playlist: any[] = []
  private get playlist(): Promise<any[]> {
    return (async () => {
      var shuffle: boolean
      var exists: boolean = existsSync(this.playlistPath)
      var contents: string
      if (!exists)
        shuffle = true
      else {
        contents = (await readFile(this.playlistPath)).toString()
        if (contents == '')
          shuffle = true
      }
      if (!this._playlist.length) {
        if (shuffle) {
          console.log(`${new Date().toISOString()} shuffling`)
          var directoryFiles: any[] = await this.wallPapers
          var playlistFiles: any[] = []
          while (playlistFiles.length < directoryFiles.length) {
            var randomIndex = Math.floor(Math.random() * directoryFiles.length)
            if (!playlistFiles.includes(directoryFiles[randomIndex])) {
              playlistFiles.push(directoryFiles[randomIndex])
            }
          }
          this._playlist = playlistFiles
          this.playlist = (async () => this._playlist)()
        }
        else
          this._playlist = contents.split('\n')
      }
      return this._playlist
    })()
  }
  private set playlist(value: Promise<any[]>) {
    (async () => {
      this._playlist = await value
      await writeFile(this.playlistPath, this._playlist.join('\n')) // survive a restart
      this._playlistIndex = 0
    })()
  }
  //#endregion

  //#region Private Methods
  private async config() {
    delete require.cache[require.resolve('../config.json')]
    var config = await import('../config.json')
    this.intervalMinutes = config.intervalMinutes
    this.wallpaperDirectory = config.wallpaperDirectory
    watch(this.wallpaperDirectory, (eventType, filename) => {
      this.wallPapers = undefined
    })
  }

  private sleep(minutes: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, minutes * 60 * 1000)
    })
  }

  private async play() {
    while (await this.wallpaper) {
      this.wallpaper = this.wallpaper
      await this.sleep(this.intervalMinutes)
      this.playlistIndex = (async () => (await this.playlistIndex) + 1)()
    }
  }
  private async shuffle() {
    await (this.playlist = (async () => [])())//clear file
    await (this.playlist = this.playlist)//new file
  }
  //#endregion

  //#region Public Methods
  async run() {
    await this.config()
    watch(join(__dirname, '../config.json'), (eventType, filename) => this.config())

    while (true) {
      await this.play()
      await this.shuffle()
    }
  }
  //#endregion

}

new WallpaperChanger().run()