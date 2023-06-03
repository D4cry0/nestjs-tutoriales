import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Car } from './interfaces/car.interface';

import { v4 as uuid } from 'uuid';
import { CreateCarDto, UpdateCarDto } from './dto';

@Injectable()
export class CarsService {

    private cars: Car[] = [
        {
            id: uuid(),
            brand: 'Toyota',
            model: 'Corola',
        },
        {
            id: uuid(),
            brand: 'Honda',
            model: 'Civic',
        },
        {
            id: uuid(),
            brand: 'Jeep',
            model: 'Cherokee',
        },
    ];

    findAll() {
        return this.cars;
    }

    findOneById( id: string ) {     
        const car = this.cars.find( car => car.id === id );

        if( !car ) throw new NotFoundException(`Car with id '${id}' not found`);
        
        return car;
    }

    create( createCartDto: CreateCarDto) {
        const car: Car = {
            id: uuid(),
            ...createCartDto
        }

        this.cars.push(car)

        return car;
    }

    update( id: string, updateCarDto: UpdateCarDto) {
        let carDB = this.findOneById(id);

        // para validar que si sea el dato id valido
        if( updateCarDto.id && updateCarDto.id !== id )
            throw new BadRequestException(`Car id is not valid inside body`);

        this.cars = this.cars.map( car => {
            if(car.id === id){
                carDB = {
                    ...carDB,
                    ...updateCarDto,
                    id
                }
                return carDB;
            }

            return car;
        });

        return carDB;
    }

    delete( id: string) {
        let carIdx: number = -1;
        this.cars.find( (car,idx) => {
            if(car.id === id){
                return carIdx = idx;
            }
        });

        if(carIdx < 0) throw new NotFoundException(`Car with id '${id}' not found`);
        
        this.cars.splice(carIdx, 1);

        return `Car with id ${id} deleted`;
    }
}
