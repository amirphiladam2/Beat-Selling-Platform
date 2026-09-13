import { IsArray, Min, IsInt } from "class-validator";

export class CreateOrderDto{
 @IsArray()
 @IsInt({each:true})
 @Min(1,{each:true})
 licenseIds!:number[];
}