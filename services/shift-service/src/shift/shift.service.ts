import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto, UpdateShiftDto } from './dto';

@Injectable()
export class ShiftService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createShiftDto: CreateShiftDto) {
    const shift = await this.prisma.shift.create({
      data: {
        ...createShiftDto,
        startTime: new Date(createShiftDto.startTime),
        endTime: new Date(createShiftDto.endTime),
      },
    });

    return {
      success: true,
      data: shift,
      message: 'Shift created successfully',
    };
  }

  async findAll(params: { page?: number; limit?: number; status?: string; employeeId?: string }) {
    const { page = 1, limit = 10, status, employeeId } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (employeeId) where.employeeId = employeeId;

    const [shifts, total] = await Promise.all([
      this.prisma.shift.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startTime: 'desc' },
      }),
      this.prisma.shift.count({ where }),
    ]);

    return {
      success: true,
      data: shifts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const shift = await this.prisma.shift.findUnique({
      where: { id },
    });

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    return {
      success: true,
      data: shift,
    };
  }

  async update(id: string, updateShiftDto: UpdateShiftDto) {
    const existingShift = await this.prisma.shift.findUnique({
      where: { id },
    });

    if (!existingShift) {
      throw new NotFoundException('Shift not found');
    }

    const updateData: any = { ...updateShiftDto };
    if (updateShiftDto.startTime) {
      updateData.startTime = new Date(updateShiftDto.startTime);
    }
    if (updateShiftDto.endTime) {
      updateData.endTime = new Date(updateShiftDto.endTime);
    }

    const shift = await this.prisma.shift.update({
      where: { id },
      data: updateData,
    });

    return {
      success: true,
      data: shift,
      message: 'Shift updated successfully',
    };
  }

  async remove(id: string) {
    const shift = await this.prisma.shift.findUnique({
      where: { id },
    });

    if (!shift) {
      throw new NotFoundException('Shift not found');
    }

    await this.prisma.shift.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Shift deleted successfully',
    };
  }
}
