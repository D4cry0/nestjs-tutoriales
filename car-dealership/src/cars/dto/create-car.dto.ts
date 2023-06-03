import { IsString } from "class-validator";

// para hacer funcionar el dto necesitas
// npm i class-validator class-transformer
// @UsePipes( ValidationPipe ) en la funcion deseada
// @Body() instanciaDto: ClaseDto OJO mismo nombre
export class CreateCarDto {
    
    @IsString({message: 'Must be a valid brand'})
    readonly brand: string;

    @IsString()
    readonly model: string;

}