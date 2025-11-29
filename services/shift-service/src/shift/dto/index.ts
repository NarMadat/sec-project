import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';

export enum ShiftStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export class CreateShiftDto {
  @ApiProperty({ example: 'employee-uuid' })
  @IsString()
  employeeId: string;

  @ApiProperty({ example: 'object-uuid' })
  @IsString()
  objectId: string;

  @ApiProperty({ example: '2024-01-01T09:00:00.000Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2024-01-01T17:00:00.000Z' })
  @IsDateString()
  endTime: string;

  @ApiProperty({ enum: ShiftStatus, example: ShiftStatus.SCHEDULED })
  @IsEnum(ShiftStatus)
  status: ShiftStatus;

  @ApiProperty({ example: 'Regular patrol shift', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateShiftDto extends PartialType(CreateShiftDto) {}
