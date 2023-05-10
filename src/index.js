import * as security from "./controllers/security.js"
import * as socket from "./controllers/socket.js"
import * as meteo from "./controllers/meteo.js"

security.start()
socket.start()
meteo.start()