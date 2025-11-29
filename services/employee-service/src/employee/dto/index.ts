import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export class CertificationDto {
  @ApiProperty({ example: 'Security Guard License' })
  @IsString()
  name: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  @IsString()
  issueDate: string;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  @IsString()
  expiryDate: string;

  @ApiProperty({ example: 'State Security Authority' })
  @IsString()
  issuingAuthority: string;
}

export class CreateEmployeeDto {
  @ApiProperty({ example: 'user-uuid' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: 'Security Guard' })
  @IsString()
  position: string;

  @ApiProperty({ enum: EmployeeStatus, example: EmployeeStatus.ACTIVE })
  @IsEnum(EmployeeStatus)
  status: EmployeeStatus;

  @ApiProperty({ type: [CertificationDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationDto)
  certifications?: CertificationDto[];
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
