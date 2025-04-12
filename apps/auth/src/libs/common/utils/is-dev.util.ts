import { ConfigService } from '@nestjs/config'
import * as dotenv from 'dotenv'
import * as process from 'node:process'

dotenv.config()

export const isDev = (configServce: ConfigService) =>
	configServce.get('NODE_ENV') === 'development'

export const IS_DEV_ENV = process.env.NODE_ENV === 'development'