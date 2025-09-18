import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersSevice : Partial<UsersService>
  let fakeAuthService : Partial<AuthService>

  beforeEach(async () => {

    fakeUsersSevice = {
      findOne:(id:number)=>{ return Promise.resolve({id, email:'email@mail.com',password:'aaaa'}as User )},
      find: (email:string)=> {return Promise.resolve([{id:1, email, password:'aaa'}as User ]) },
      remove: (id:number)=>{ return Promise.resolve({id,email:'adh@dd.com',password:'aaa'}as User )}
    }
    fakeAuthService = {
      signin: (email:string, password:string)=>{return Promise.resolve({id:1, email, password}as User)},
      signup: (email:string, password:string)=>{ return Promise.resolve({id:1, email, password}as User)}
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers:[
        {
          provide: UsersService,
          useValue: fakeUsersSevice
        },
        {
          provide:AuthService,
          useValue:fakeAuthService
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findUser returns a single user with the given id', async()=>{
    const user = await controller.findUser('1')
    expect(user).toBeDefined()
  })

  it('return user when give emali',async()=>{
    const user = await controller.findAllUser('aaa@aa@.com')
    expect(user[0].email).toEqual('aaa@aa@.com')
    expect(user.length).toEqual(1)
  })
  it('find user will be delete',async ()=>{
    const user = await controller.removeUser('2')
    expect(user.id).toEqual(2)
  })

  it('signin updates session object and returns user',async ()=>{
    const session = {userId:-2};
    const user = await controller.signin(
      {email:'email@mail.com' ,password: '111'}
      ,session
    )
    expect(user.id).toEqual(1)
    expect(session.userId).toEqual(1)
  })

  it('signup add session object and return user',async()=>{
    const session = {userId:11}
    const user = await controller.signUp(
      {email:'sss@ss.com',password:'sss'},
      session
    )
    expect(user.id).toEqual(1)
    expect(session.userId).toEqual(1)
  })

});
