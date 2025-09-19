import { 
  IsString,
  IsNumber,
  Max,
  Min,
  IsLatitude,
  IsLongitude,
  IsBoolean
 } from 'class-validator'

 export class CreateReportDto{

  @IsString()
  make:string

  @IsString()
  model:string

  @IsNumber()
  @Min(0)
  @Max(1000000)
  price:number

  @IsNumber()
  @Min(1930)
  @Max(2030)
  year:number

  @IsNumber()
  @IsLatitude()
  lat:number

  @IsNumber()
  @IsLongitude()
  lng:number

  @IsNumber()
  @Max(1000000)
  @Min(0)
  mileage:number

 }