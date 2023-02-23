import App from "./app"
import AppPersistence from "./app.persistence"
import { log } from "./lib"

async function main() {
  for await (var play of new AppPersistence(new App).instance) {
    log(play)
  }
}

main()