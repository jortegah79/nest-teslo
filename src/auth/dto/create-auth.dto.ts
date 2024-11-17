import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsEmail()
    @IsString()
    email:string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z])[A-Za-z\d]{6,}$/)
    password:string;

    @IsString()
    @MinLength(2)
    fullname:string;

}
