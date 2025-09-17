import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException } from "@nestjs/common";

describe('Auth Service',()=>{
  let service : AuthService
  let fakeUsersService:Partial<UsersService>
  beforeEach(async()=>{
    const users:User[] = []
    fakeUsersService  = {
    find:(email:string)=>{ 
      const filteredUsers = users.filter((user)=> user.email == email)
      return Promise.resolve(filteredUsers)
    },
    // Promise.resolve({id:1, email, password} as User)
    create: (email:string, password:string) => {
      const user = {
        id : Math.floor(Math.random()*999999) ,
        email,
        password
      } as User
      users.push(user)
      return Promise.resolve(user)
    }
  }

  const module = await Test.createTestingModule({
    providers:[AuthService,
    {
      provide:UsersService,
      useValue:fakeUsersService
    }
  ]
  }).compile()

  service = module.get(AuthService)
  })

  it(' can create a instance a Auth service ' , ()=>{

  expect(service).toBeDefined()
  })

  it('create a new user using salt and hash', async()=>{
    const user = await service.signup('aas@sdd.com','dsd')

    expect(user.password).not.toEqual('dsaadd')
    const [ salt, hash ] = user.password.split('.')
    expect(salt).toBeDefined()
    expect(hash).toBeDefined()
  })

  it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () => 
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
    
    // throw error becuase find element in array  { id: 1, email: 'a', password: '1' }
    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if signin is called with an unused email',async()=>{
   await expect(service.signin('aaa:@aaa.com','sss')).rejects.toThrow(BadRequestException)
  })

  it('throws if an invalid password is provided', async ()=>{
    fakeUsersService.find = () => 
      Promise.resolve([{id:1, email:'aaa@aa.com', password:'jdddd'} as User])
      await expect(service.signin('AA@aa.com', 'www')).rejects.toThrow(BadRequestException)
  })
  it('password is provided',async ()=>{
   await service.signup('aaa@aaa.com','mypassword')
   const user = await service.signin('aaa@aaa.com','mypassword')
   expect(user).toBeDefined()
  })
})
