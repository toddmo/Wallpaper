import Configuration from "./configuration"
import Playlist from "./playlist"

export default class PlaylistPersistence {

  constructor(playlist: Playlist) {
    this._config = new Configuration(playlist, '../playlist.json')
    var self = this
    this.instance = new Proxy(playlist, {
      get(target, property) {
        var defaultValue: any = {
          items: [],
          cursor: -1
        }[property]
        if (defaultValue)
          self._config.read(property, defaultValue)
        return target[property]
      },
      set(target, property, newValue, receiver) {
        switch (property) {
          case 'items':
          case 'cursor':
            self._config.write(property, newValue)
        }
        target[property] = newValue
        return true
      }
    })

  }
  private _config: Configuration
  instance: Playlist
}

