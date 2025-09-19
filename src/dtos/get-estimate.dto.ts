import { 
  IsString,
  IsNumber,
  Max,
  Min,
  IsLatitude,
  IsLongitude
 } from 'class-validator'
 import { Transform } from 'class-transformer'

 export class GetEstimateDto{

  @IsString()
  make:string

  @IsString()
  model:string

  @Transform((({value})=>parseInt(value)))
  @IsNumber()
  @Min(1930)
  @Max(2030)
  year:number

  @Transform((({value})=>parseFloat(value)))
  @IsNumber()
  @IsLatitude()
  lat:number

  @Transform((({value})=>parseFloat(value)))
  @IsNumber()
  @IsLongitude()
  lng:number

  @Transform((({value})=>parseInt(value)))
  @IsNumber()
  @Max(1000000)
  @Min(0)
  mileage:number

 }