import { Controller, Post, Get, Delete, Patch, NotFoundException, Query, Param, Body, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create.user.dto'
import { UpdateUserDto } from '../dtos/update.user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { serialize } from 'src/interseptors/serialize.interceptor';
import { UserDto } from 'src/dtos/user.dto';
import { CurrentUser } from './decoration/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private AuthService : AuthService
  ){}

  // @Get('/whoiam')
  // currentUser(@Session() session:any){
  //   return this.usersService.findOne(session.userId)
  // }
  @Get('/whoiam')
  @UseGuards(AuthGuard)
  WhoIAm(@CurrentUser() user:User){
    return user;
  }

  @Post('/signout')
  signOut(@Session() session:any){
    session.userId = null;
  }

  @Post('/signup')
   async createUser(@Body() body: CreateUserDto, @Session() session:any ){
    const user = await this.AuthService.signup(body.email, body.password)
    session.userId = user.id
    return user;
  }

  @Post('/signin')
  async signin(@Body() body:CreateUserDto, @Session() session:any){
    const user = await this.AuthService.signin(body.email, body.password)
    session.userId = user.id
    return user;
  }

  @serialize(UserDto)
  @Get('/:id')
  async findUser(@Param('id') id:string){
    console.log( ' interceptor is runnig')
    const user = await this.usersService.findOne(parseInt(id))
    if(!user){
      throw new NotFoundException(' not found user')
    }
    return user;
  }

  @Get()
  findAllUser(@Query('email') email:string){
    return this.usersService.find(email)
  }

  @Delete('/:id')
  removeUser(@Param('id') id:string){
    return this.usersService.remove(parseInt(id))
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string , @Body() body: UpdateUserDto ){
  return this.usersService.update(parseInt(id), body)
  }
}
