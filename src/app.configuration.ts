import { readFileSync, watch, writeFileSync } from "fs"
import { join } from "path"
import os = require("os")

import App from "./app"

export default class AppConfiguration {
  constructor(app: App) {
    this.instance = app
    this.applyConfig()
    this.watchFileSystem()
  }

  instance: App

  _configFile = join(__dirname, '../config.json')
  get config() {
    var config = JSON.parse(readFileSync(this._configFile).toString())
    if (config.wallpaperDirectory == '') {
      config.wallpaperDirectory = `${os.homedir()}/Pictures`
      writeFileSync(this._configFile, JSON.stringify(config))
    }
    return config
  }
  set config(value) {
    Object.assign(this.instance, value)
  }

  applyConfig = () => this.config = this.config

  watchFileSystem() {
    watch(this._configFile, () => {
      this.applyConfig()
    })
  }


}