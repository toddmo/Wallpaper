import { existsSync, readFileSync, writeFileSync } from "fs"
import { join } from "path"

import Playlist from "./playlist"

export default class PlaylistPersistence {
  constructor(playlist: Playlist) {
    var self = this
    this.instance = new Proxy(playlist, {
      get(target, property) {
        switch (property) {
          case 'items':
            target._items = self.read(target, property, [])
            break
          case 'cursor':
            target._cursor = self.read(target, property, -1)
            break
        }
        return target[property]
      },
      set(target, property, newValue, receiver) {
        switch (property) {
          case 'items':
            self.write(property, newValue)
            break
          case 'cursor':
            self.write(property, newValue)
            break
        }
        target[property] = newValue
        return true
      }
    })

  }

  instance: Playlist

  _file = join(__dirname, '../playlist.json')
  read(target: Playlist, property: string, defaultValue: any): any {
    if (target[property])
      return target[property]
    else if (existsSync(this._file))
      return JSON.parse(readFileSync(this._file).toString())[property]
    else
      return defaultValue
  }
  write(property: string, value: string) {
    var persist = JSON.parse(readFileSync(this._file).toString())
    persist[property] = value
    writeFileSync(this._file, JSON.stringify(persist, undefined, 2))
  }

}

