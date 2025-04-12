import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import {v4 as uuidv4} from 'uuid'
import { TokenType } from '@prisma/__generated__'
import { ConfirmationDto } from '@/auth/email-confirmation/dto/confirmation.dto'
import { Request } from 'express'
import { MailService } from '@/libs/mail/mail.service'
import { UserService } from '@/user/user.service'
import { AuthService } from '@/auth/auth.service'

@Injectable()
export class EmailConfirmationService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly userService: UserService,
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService
	) {}

	public async newVerification(req: Request, dto: ConfirmationDto) {
		const existingToken = await this.prismaService.token.findUnique({
			where: {
				token: dto.token,
				type: TokenType.VERIFICATION
			}
		})

		if (!existingToken) {
			throw new NotFoundException(
				'Токен подтверждения не найден. Пожалуйста, убедитесь, что у вас правильный токен.'
			)
		}

		const isExpired = new Date(existingToken.expiresIn) < new Date()

		if (isExpired) {
			throw new BadRequestException(
				'Токен подтверждения истек. Пожалуйста, запросите новый токен для подтверждения.'
			)
		}

		const existingUser = await this.userService.findByEmail(
			existingToken.email
		)

		if (!existingToken) {
			throw new NotFoundException(
				'Пользователь с указанным адресом электронной почты не найден. ' +
				'Пожалуйста, убедитесь, что вы ввели правильный email.'
			)
		}

		await this.prismaService.user.update({
			where: {
				id: existingUser.id
			},
			data: {
				isVerified: true
			}
		})

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.VERIFICATION
			}
		})

		return this.authService.saveSession(req, existingUser)
	}

	public async sendVerificationToken(email: string) {
		const verificationToken = await this.generateVerificationToken(email)
		await this.mailService.sendConfirmationEmail(verificationToken.email, verificationToken.token)

		return true
	}

	private async generateVerificationToken(email: string) {
		const token = uuidv4()
		const expiresIn = new Date(new Date().getTime() + 3600 * 1000) // Время жизни - 1 час

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.VERIFICATION
			}
		})

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id,
					type: TokenType.VERIFICATION
				}
			})
		}

		const verificationToken = await  this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.VERIFICATION
			}
		})

		return verificationToken
	}
}
