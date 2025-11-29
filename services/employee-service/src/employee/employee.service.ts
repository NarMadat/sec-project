import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const employee = await this.prisma.employee.create({
      data: createEmployeeDto,
      include: {
        certifications: true,
      },
    });

    return {
      success: true,
      data: employee,
      message: 'Employee created successfully',
    };
  }

  async findAll(params: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 10, status } = params;
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [employees, total] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        skip,
        take: limit,
        include: {
          certifications: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.employee.count({ where }),
    ]);

    return {
      success: true,
      data: employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        certifications: true,
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return {
      success: true,
      data: employee,
    };
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const updatedEmployee = await this.prisma.employee.update({
      where: { id },
      data: updateEmployeeDto,
      include: {
        certifications: true,
      },
    });

    return {
      success: true,
      data: updatedEmployee,
      message: 'Employee updated successfully',
    };
  }

  async remove(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    await this.prisma.employee.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Employee deleted successfully',
    };
  }
}
