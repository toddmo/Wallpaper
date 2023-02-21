import { readdirSync, watch } from "fs"
import path = require("path")

import App from "./app"
import AppConfiguration from "./app.configuration"
import Playlist from "./playlist"
import PlaylistPersistence from "./playlist.persistence"

export default class AppPersistence {
  constructor(app: App) {
    this.instance = new Proxy(app, {
      get(target, property) {
        switch (property) {
          case 'playlist':
            if (!target._playlist)
              target._playlist = new PlaylistPersistence(new Playlist()).instance

            break
          case 'wallpapers':
            if (!target._wallpapers)
              target._wallpapers = (readdirSync(target.wallpaperDirectory))
                .map(o => path.join(target.wallpaperDirectory, o))
            break
        }
        return target[property]
      }
    })
    this.config = new AppConfiguration(this.instance)
    this.watchFileSystem()
  }

  instance: App
  config: AppConfiguration

  watchFileSystem() {
    watch(this.instance.wallpaperDirectory, () => {
      this.instance.wallpapers = undefined
    })
  }


}
