import dotenv from 'dotenv'
import path from 'path'

dotenv.config({path: path.join( process.cwd(),'src','.env' )})

const pgConfig = {
	user: process.env.PG_USER,
	host: process.env.PG_HOST,
	database: process.env.PG_DATABASE,
	port: process.env.PG_PORT,
	password: process.env.PG_PASSWORD
}

export {
	pgConfig
}