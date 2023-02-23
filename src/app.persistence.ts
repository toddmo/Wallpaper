import { watch } from "fs"

import App from "./app"
import Configuration from "./configuration"
import { pictureDirectory } from "./lib"
import Playlist from "./playlist"
import PlaylistPersistence from "./playlist.persistence"

export default class AppPersistence {
  constructor(app: App) {
    this._config = new Configuration(app, '../config.json')
    this.playlistPersistance = new PlaylistPersistence(new Playlist())
    var self = this
    this.instance = new Proxy(app, {
      get(target, property) {
        switch (property) {
          case 'intervalMinutes':
            self._config.read(property, 1)
            break
          case 'wallpaperDirectory':
            self._config.read(property, pictureDirectory())
            break
          case 'playlist':
            if (!target._playlist)
              target._playlist = self.playlistPersistance.instance
            break
        }
        return target[property]
      }
    })
    this.watchFileSystem()
  }

  _config: Configuration
  instance: App
  playlistPersistance: PlaylistPersistence

  watchFileSystem() {
    watch(this.instance.wallpaperDirectory, () => this.instance.wallpapers = undefined)
  }


}
