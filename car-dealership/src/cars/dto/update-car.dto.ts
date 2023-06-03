import { IsOptional, IsString, IsUUID } from "class-validator";

// para hacer funcionar el dto necesitas
// npm i class-validator class-transformer
// @UsePipes( ValidationPipe ) en la funcion deseada
// @Body() instanciaDto: ClaseDto OJO mismo nombre
export class UpdateCarDto {
    
    @IsString()
    @IsUUID()
    @IsOptional()
    readonly id?: string;
    
    @IsString({message: 'Must be a valid brand'})
    @IsOptional()
    readonly brand?: string;
    
    @IsString()
    @IsOptional()
    readonly model?: string;

}