import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsEnum, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum SecurityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export class CoordinatesDto {
  @ApiProperty({ example: 40.7128 })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: -74.0060 })
  @IsNumber()
  longitude: number;
}

export class EmergencyContactDto {
  @ApiProperty({ example: 'John Smith' })
  @IsString()
  name: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Security Manager' })
  @IsString()
  role: string;
}

export class CreateObjectDto {
  @ApiProperty({ example: 'client-uuid' })
  @IsString()
  clientId: string;

  @ApiProperty({ example: 'Office Building A' })
  @IsString()
  name: string;

  @ApiProperty({ example: '123 Main St, New York, NY' })
  @IsString()
  address: string;

  @ApiProperty({ type: CoordinatesDto })
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;

  @ApiProperty({ enum: SecurityLevel, example: SecurityLevel.MEDIUM })
  @IsEnum(SecurityLevel)
  securityLevel: SecurityLevel;

  @ApiProperty({ type: [String], example: ['Access control', 'CCTV monitoring'] })
  @IsArray()
  @IsString({ each: true })
  protocols: string[];

  @ApiProperty({ type: [EmergencyContactDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmergencyContactDto)
  emergencyContacts: EmergencyContactDto[];
}

export class UpdateObjectDto extends PartialType(CreateObjectDto) {}
