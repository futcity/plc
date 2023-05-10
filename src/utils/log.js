export const mod = {
    INDEX:      "INDEX",
    SOCKET:     "SOCKET",
    SECURITY:   "SECURITY",
    METEO:      "METEO"
}

export function info(mod, message) {
    console.log("INFO", mod, message)
}

export function error(mod, message, err="") {
    console.log("ERROR", mod, message, err)
}