import App from "./app"
import AppPersistence from "./app.persistence"

async function main() {
  for await (var status of new AppPersistence(new App).instance) {
    console.log(status)
  }
}

main()