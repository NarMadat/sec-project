import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ObjectService } from './object.service';
import { CreateObjectDto, UpdateObjectDto } from './dto';

@ApiTags('Protected Objects')
@ApiBearerAuth()
@Controller('objects')
export class ObjectController {
  constructor(private readonly objectService: ObjectService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new protected object' })
  @ApiResponse({ status: 201, description: 'Object created successfully' })
  create(@Body() createObjectDto: CreateObjectDto) {
    return this.objectService.create(createObjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all protected objects' })
  @ApiResponse({ status: 200, description: 'List of protected objects' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'securityLevel', required: false, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('securityLevel') securityLevel?: string,
  ) {
    return this.objectService.findAll({ page, limit, securityLevel });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get object by ID' })
  @ApiResponse({ status: 200, description: 'Object details' })
  findOne(@Param('id') id: string) {
    return this.objectService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update object' })
  @ApiResponse({ status: 200, description: 'Object updated successfully' })
  update(@Param('id') id: string, @Body() updateObjectDto: UpdateObjectDto) {
    return this.objectService.update(id, updateObjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete object' })
  @ApiResponse({ status: 200, description: 'Object deleted successfully' })
  remove(@Param('id') id: string) {
    return this.objectService.remove(id);
  }
}
