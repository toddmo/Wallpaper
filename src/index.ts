import App from "./app"
import AppPersistence from "./app.persistence"
import { library } from "./lib"

async function main() {
  for await (var play of new AppPersistence(new App).instance) {
    library.system.log(play)
  }
}

main()