import App from "./app"
import AppPersistence from "./app.persistence"

async function main() {
  for await (var play of new AppPersistence(new App).instance) {
    console.log(`played ${play.length}`)
  }
}

main()