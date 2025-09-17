import { BadRequestException, Injectable } from "@nestjs/common";
import { UsersService } from "./users.service";
import {randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { error } from "console";

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService{
  constructor(private UsersService: UsersService){}

  async signup(email:string, password:string){
    const users = await this.UsersService.find(email)
    if(users.length){
      throw new BadRequestException('Email is used')
    }
    //Hash the users Password
    //Generate a salt
    const salt = randomBytes(8).toString('hex')
    //Hash a salt and password together
    const hash = (await scrypt(password, salt, 32)) as Buffer
    //join Hash result and the salt together
    const result = salt + '.' + hash.toString('hex') 
    //create a new user and save it 
    const user = await this.UsersService.create(email,result)
    // return the user
    return user;
  }

  async signin(email:string, password:string){
    const [user] = await this.UsersService.find(email)
    if(!user){
      throw new BadRequestException('User Not Found')
    }
    const [salt, sortedHash] = user.password.split('.')
    const hash = (await scrypt(password,salt,32)) as Buffer //return bainary
    if(sortedHash !== hash.toString('hex')){
      throw new BadRequestException('password is bad')
    }
    return user;
  }
}