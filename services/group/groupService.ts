import { prisma } from '@/lib/prisma/client';
import type { CreateGroupInput, InviteMemberInput, RemoveMemberInput } from '@/validations/group/schema';
import { getSession } from '@/lib/auth/session';

export class GroupService {
  async createGroup(input: CreateGroupInput) {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');
    
    const group = await prisma.group.create({
      data: {
        name: input.name,
        description: input.description,
        currency: input.currency,
        createdBy: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            joinDate: new Date(),
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
    
    return group;
  }
  
  async getGroups(userId: string) {
    return prisma.group.findMany({
      where: {
        members: {
          some: { userId, leaveDate: null },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
          where: { leaveDate: null },
          orderBy: { joinDate: 'asc' },
        },
        expenses: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            expenses: true,
            members: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  
  async getGroup(groupId: string, userId: string) {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');
    
    const isMember = await prisma.groupMember.findFirst({
      where: {
        groupId,
        userId: session.user.id,
        leaveDate: null,
      },
    });
    
    if (!isMember) {
      throw new Error('Not a member of this group');
    }
    
    return prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: true,
          },
          where: { leaveDate: null },
          orderBy: { joinDate: 'asc' },
        },
        expenses: {
          include: {
            payer: true,
            participants: {
              include: {
                user: true,
              },
            },
          },
          orderBy: { date: 'desc' },
        },
        settlements: {
          include: {
            payer: true,
            receiver: true,
          },
          orderBy: { date: 'desc' },
        },
      },
    });
  }
  
  async inviteMember(input: InviteMemberInput) {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');
    
    const isCreator = await prisma.group.findFirst({
      where: {
        id: input.groupId,
        createdBy: session.user.id,
      },
    });
    
    if (!isCreator) {
      throw new Error('Only group creator can invite members');
    }
    
    const user = await prisma.user.findUnique({
      where: { id: input.userId },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const existingMember = await prisma.groupMember.findFirst({
      where: {
        groupId: input.groupId,
        userId: input.userId,
        leaveDate: null,
      },
    });
    
    if (existingMember) {
      throw new Error('User is already a member');
    }
    
    const member = await prisma.groupMember.create({
      data: {
        groupId: input.groupId,
        userId: input.userId,
        joinDate: input.joinDate ? new Date(input.joinDate) : new Date(),
      },
      include: {
        user: true,
      },
    });
    
    return member;
  }
  
  async removeMember(input: RemoveMemberInput) {
    const session = await getSession();
    if (!session) throw new Error('Unauthorized');
    
    const isCreator = await prisma.group.findFirst({
      where: {
        id: input.groupId,
        createdBy: session.user.id,
      },
    });
    
    if (!isCreator) {
      throw new Error('Only group creator can remove members');
    }
    
    const member = await prisma.groupMember.findFirst({
      where: {
        groupId: input.groupId,
        userId: input.userId,
      },
    });
    
    if (!member) {
      throw new Error('User is not a member');
    }
    
    await prisma.groupMember.update({
      where: { id: member.id },
      data: {
        leaveDate: input.leaveDate ? new Date(input.leaveDate) : new Date(),
      },
    });
    
    return { success: true };
  }
  
  async getActiveMembers(groupId: string, date?: Date) {
    const queryDate = date || new Date();
    
    return prisma.groupMember.findMany({
      where: {
        groupId,
        joinDate: { lte: queryDate },
        OR: [
          { leaveDate: null },
          { leaveDate: { gte: queryDate } },
        ],
      },
      include: {
        user: true,
      },
    });
  }
}

export const groupService = new GroupService();