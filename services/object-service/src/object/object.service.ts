import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateObjectDto, UpdateObjectDto } from './dto';
import { Prisma, SecurityLevel } from '../../prisma/generated';

@Injectable()
export class ObjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createObjectDto: CreateObjectDto) {
    const { clientId, coordinates, emergencyContacts, ...objectData } = createObjectDto;

    const object = await this.prisma.protectedObject.create({
      data: {
        ...objectData,
        securityLevel: objectData.securityLevel as SecurityLevel,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        client: {
          connect: { id: clientId },
        },
        emergencyContacts: emergencyContacts.length
          ? {
              create: emergencyContacts.map((contact) => ({
                name: contact.name,
                phone: contact.phone,
                role: contact.role,
              })),
            }
          : undefined,
      } satisfies Prisma.ProtectedObjectCreateInput,
      include: {
        emergencyContacts: true,
      },
    });

    return {
      success: true,
      data: object,
      message: 'Protected object created successfully',
    };
  }

  async findAll(params: { page?: number; limit?: number; securityLevel?: string }) {
    const { page = 1, limit = 10, securityLevel } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ProtectedObjectWhereInput = securityLevel
      ? { securityLevel: securityLevel as SecurityLevel }
      : {};

    const [objects, total] = await Promise.all([
      this.prisma.protectedObject.findMany({
        where,
        skip,
        take: limit,
        include: {
          emergencyContacts: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.protectedObject.count({ where }),
    ]);

    return {
      success: true,
      data: objects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const object = await this.prisma.protectedObject.findUnique({
      where: { id },
      include: {
        emergencyContacts: true,
      },
    });

    if (!object) {
      throw new NotFoundException('Protected object not found');
    }

    return {
      success: true,
      data: object,
    };
  }

  async update(id: string, updateObjectDto: UpdateObjectDto) {
    const object = await this.prisma.protectedObject.findUnique({
      where: { id },
    });

    if (!object) {
      throw new NotFoundException('Protected object not found');
    }

    const {
      coordinates: updateCoordinates,
      emergencyContacts: updateContacts,
      clientId: newClientId,
      ...updateData
    } = updateObjectDto;

    const updatedObject = await this.prisma.protectedObject.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateData.securityLevel
          ? { securityLevel: updateData.securityLevel as SecurityLevel }
          : {}),
        ...(updateCoordinates
          ? {
              latitude: updateCoordinates.latitude,
              longitude: updateCoordinates.longitude,
            }
          : {}),
        ...(newClientId
          ? {
              client: {
                connect: { id: newClientId },
              },
            }
          : {}),
        ...(updateContacts
          ? {
              emergencyContacts: {
                deleteMany: { objectId: id },
                create: updateContacts.map((contact) => ({
                  name: contact.name,
                  phone: contact.phone,
                  role: contact.role,
                })),
              },
            }
          : {}),
      } satisfies Prisma.ProtectedObjectUpdateInput,
      include: {
        emergencyContacts: true,
      },
    });

    return {
      success: true,
      data: updatedObject,
      message: 'Protected object updated successfully',
    };
  }

  async remove(id: string) {
    const object = await this.prisma.protectedObject.findUnique({
      where: { id },
    });

    if (!object) {
      throw new NotFoundException('Protected object not found');
    }

    await this.prisma.protectedObject.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Protected object deleted successfully',
    };
  }
}
