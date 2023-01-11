import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import { UserDto } from "./dto/user.dto";
import { User } from "./entities/user.entity";
import { UserRepository } from "./user.repository";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async findByFields(option: FindOneOptions<UserDto>): Promise<User | undefined> {
        return await this.userRepository.findOne(option);
    }

    async save(userDto: UserDto): Promise<UserDto | undefined> {
        await this.transPassword(userDto );
        return await this.userRepository.save(userDto);
    }

    async transPassword(user: UserDto): Promise<void> {
        user.password = await bcrypt.hash(user.password, 12);
    }
}