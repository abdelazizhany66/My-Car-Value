import { Entity, Column,PrimaryGeneratedColumn, AfterInsert, AfterRemove, AfterUpdate } from "typeorm";
import { Exclude } from "class-transformer";

@Entity()
export class User{
  @PrimaryGeneratedColumn()
  id:number

  @Column()
  email:string
  
  @Exclude()
  @Column()
  password:string

  @AfterInsert()
  logInsert(){
    console.log('Inserted User With Id', this.id)
  }

  @AfterUpdate()
  logUpdate(){
    console.log('Updated User With Id', this.id)
  }

  @AfterRemove()
  logRemove(){
    console.log('Removed User With Id', this.id)
  }

}