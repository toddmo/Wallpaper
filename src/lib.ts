import os = require("os")
import { exec } from "child_process"
import { readdir } from "fs/promises"
import path = require("path")

export namespace library {
  export namespace arrays {
    export const shuffle = (items: any[]) => items.reduce(
      ([original, shuffled]) =>
        [original, [...shuffled, ...original.splice(Math.random() * original.length | 0, 1)]],
      [[...items], []]
    )[1]

  }

  export namespace timing {
    export const never = false
    // const myEventHandler = debounce(() => alert('hi'), 500)
    export function debounce(fn: Function, timeoutMilliseconds: number) {
      let timer: NodeJS.Timeout
      return (...args: any[]) => {
        clearTimeout(timer)
        timer = setTimeout(() => { fn.apply(this, args) }, timeoutMilliseconds)
      }
    }
    export const sleep = async (minutes: number) => await new Promise(resolve => setTimeout(resolve, minutes * 60 * 1000))
    export const waitForValue = async (context: any, property: string) => await new Promise((resolve, reject) => {
      const loop = () => context[property] !== undefined ? resolve(context[property]) : setTimeout(loop, 100)
      loop()
    })

  }

  export namespace imaging {
    var imageTypes = {
      svg: "image/svg+xml",
      png: "image/png",
      jpg: "image/jpeg"
    }
    export const imageMimeTypes = Object.values(imageTypes)
    export const images = async (directory: string, includeSubdirectories: boolean) =>
      await (await readdir(directory, { withFileTypes: true }))
        .reduce(async (_, o) => {
          var fullPath = path.join(directory, o.name)
          var fileMimeType = await library.system.mimeType(fullPath)
          return [...await _, ...includeSubdirectories && o.isDirectory() ? (await images(fullPath, includeSubdirectories)) : imageMimeTypes.includes(fileMimeType) && [fullPath]]
        },
          Promise.resolve([])
        )
    export const pictureDirectory = () => `${os.homedir()}/Pictures`
    export const setWallpaper = (file: string) => library.system.execute(`gsettings set org.gnome.desktop.background picture-uri 'file:///${file}'`)

  }

  export namespace system {
    export const execute = async (command: string) => await new Promise(resolve => exec(command, (err, stdout, stderr) => resolve(stdout)))
    export const mimeType = async (file: string): Promise<string> => {
      var result = await execute(`file --mime-type '${file}'`) as string
      return result.split(':')[1].trim()
    }
    export const log = (message: string) => console.log(`${new Date().toISOString()} ${message}`)
    // import glob = require("glob")
    // var getDirectories = function (src, callback) {
    //   glob(src + '/**/*', callback)
    // }

  }
}



