import os = require("os")
import { exec } from "child_process"
import { readdir } from "fs/promises"
import path = require("path")

export const sleep = async (minutes: number) => await new Promise(resolve => setTimeout(resolve, minutes * 60 * 1000))
export const execute = async (command: string) => await new Promise(resolve => exec(command, (err, stdout, stderr) => resolve(stdout)))
export const mimeType = async (file: string): Promise<string> => {
  var result = await execute(`file --mime-type '${file}'`) as string
  return result.split(':')[1].trim()
}
export const images = async (directory: string) => await (await readdir(directory))
  .map(o => path.join(directory, o))
  .reduce(async (acc, o) => {
    var previous = await acc
    var fileMimeType = await mimeType(o)
    return [...previous, ...imageMimeTypes.includes(fileMimeType) ? [o] : []]
  },
    Promise.resolve([])
  )

export const waitForValue = async (context: any, property: string) => await new Promise((resolve, reject) => {
  const loop = () => context[property] !== undefined ? resolve(context[property]) : setTimeout(loop, 100)
  loop()
})

export const shuffle = (items: any[]) => items.reduce(
  ([original, shuffled]) =>
    [original, [...shuffled, ...original.splice(Math.random() * original.length | 0, 1)]],
  [[...items], []]
)[1]
export const log = (message: string) => console.log(`${new Date().toISOString()} ${message}`)
export const setWallpaper = (file: string) => execute(`gsettings set org.gnome.desktop.background picture-uri 'file:///${file}'`)
export const pictureDirectory = () => `${os.homedir()}/Pictures`
// const myEventHandler = debounce(() => alert('hi'), 500)
export function debounce(fn: Function, timeoutMilliseconds: number) {
  let timer: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => { fn.apply(this, args) }, timeoutMilliseconds)
  }
}

export const never = false

var imageTypes = {
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg"
}

export const imageMimeTypes = Object.values(imageTypes)