import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ShiftService } from './shift.service';
import { CreateShiftDto, UpdateShiftDto } from './dto';

@ApiTags('Shifts')
@ApiBearerAuth()
@Controller('shifts')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shift' })
  @ApiResponse({ status: 201, description: 'Shift created successfully' })
  create(@Body() createShiftDto: CreateShiftDto) {
    return this.shiftService.create(createShiftDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shifts' })
  @ApiResponse({ status: 200, description: 'List of shifts' })
  @ApiQuery({ name: 'status', required: false, enum: ['SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED'] })
  @ApiQuery({ name: 'employeeId', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('employeeId') employeeId?: string,
  ) {
    return this.shiftService.findAll({ page, limit, status, employeeId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shift by ID' })
  findOne(@Param('id') id: string) {
    return this.shiftService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update shift' })
  update(@Param('id') id: string, @Body() updateShiftDto: UpdateShiftDto) {
    return this.shiftService.update(id, updateShiftDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete shift' })
  remove(@Param('id') id: string) {
    return this.shiftService.remove(id);
  }
}
