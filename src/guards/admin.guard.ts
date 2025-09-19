import { BadRequestException, ExecutionContext, NestInterceptor } from "@nestjs/common";


export class AdminGuard implements NestInterceptor{
  intercept(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    if(!request.currentUser){
      throw new BadRequestException('you dont have premition')
    }
    return request.currentUser.admin
  }
}