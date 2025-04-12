import { forwardRef, Module } from '@nestjs/common'
import { MailModule } from '@/libs/mail/mail.module'
import { AuthModule } from '@/auth/auth.module'
import { EmailConfirmationController } from '@/auth/email-confirmation/email-confirmation.controller'
import { EmailConfirmationService } from '@/auth/email-confirmation/email-confirmation.service'
import { UserService } from '@/user/user.service'
import { MailService } from '@/libs/mail/mail.service'



@Module({
  imports: [MailModule, forwardRef(() => AuthModule)],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService, UserService, MailService],
  exports: [EmailConfirmationService]
})
export class EmailConfirmationModule {}
