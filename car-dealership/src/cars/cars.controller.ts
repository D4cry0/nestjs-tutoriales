import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto, UpdateCarDto } from './dto';

@Controller('cars')
// @UsePipes( ValidationPipe ) a nivel de todo el controlador
export class CarsController {

    constructor(
        private readonly carsService: CarsService
    ) {

    }

    @Get()
    getAllCars() {
        return this.carsService.findAll();
    }

    @Get(':id')
    getCarById( @Param('id', new ParseUUIDPipe({version: '4'})) id: string ) {
        return {
            car: this.carsService.findOneById(id)
        }
    }

    @Post()
    // @UsePipes( ValidationPipe ) a nivel local
    createCar( @Body() createCarDto: CreateCarDto ) {
        

        return {
            ok: true,
            method: 'post',
            car: this.carsService.create(createCarDto)
        }
    }

    @Patch(':id')
    updateCar( 
        @Param('id', new ParseUUIDPipe({version: '4'})) id: string,
        @Body() updateCarDto: UpdateCarDto 
    ) {

        return {
            ok: true,
            method: 'post',
            car: this.carsService.update(id, updateCarDto )
        }
    }

    @Delete(':id')
    deleteCar( @Param('id', new ParseUUIDPipe({version: '4'})) id: string ) {
        return {
            id,
            method: 'delete',
            msg: this.carsService.delete(id)
        }
    }
}
