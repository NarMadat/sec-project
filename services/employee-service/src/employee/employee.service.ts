import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeStatus } from './dto';
import { Prisma } from '../../prisma/generated';

@Injectable()
export class EmployeeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    const { certifications = [], ...employeeData } = createEmployeeDto;

    const employee = await this.prisma.employee.create({
      data: {
        ...employeeData,
        status: employeeData.status as EmployeeStatus,
        certifications: certifications.length
          ? {
              create: certifications.map((cert) => ({
                name: cert.name,
                issueDate: new Date(cert.issueDate),
                expiryDate: new Date(cert.expiryDate),
                issuingAuthority: cert.issuingAuthority,
              })),
            }
          : undefined,
      } satisfies Prisma.EmployeeCreateInput,
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

    const where: Prisma.EmployeeWhereInput = status
      ? { status: status as EmployeeStatus }
      : {};

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

    const { certifications, ...updateData } = updateEmployeeDto;

    const updatedEmployee = await this.prisma.employee.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.status ? { status: updateData.status as EmployeeStatus } : {}),
        ...(certifications
          ? {
              certifications: {
                deleteMany: { employeeId: id },
                create: certifications.map((cert) => ({
                  name: cert.name,
                  issueDate: new Date(cert.issueDate),
                  expiryDate: new Date(cert.expiryDate),
                  issuingAuthority: cert.issuingAuthority,
                })),
              },
            }
          : {}),
      } satisfies Prisma.EmployeeUpdateInput,
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
