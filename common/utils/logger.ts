import winston from "winston"

export const logger = winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston.format.json(),
    transports: [
        process.env.NODE_ENV === "production"
            ? new winston.transports.Console({
                  format: winston.format.json()
              })
            : new winston.transports.Console({
                  format: winston.format.combine(
                      winston.format.colorize(),
                      winston.format.simple()
                  )
              })
    ]
})
