import { Server, Socket } from 'socket.io';

export const initSocket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join organization/workspace room
    socket.on('join_workspace', (workspaceId: string) => {
      socket.join(workspaceId);
      console.log(`Socket ${socket.id} joined workspace ${workspaceId}`);
    });

    // Leave organization/workspace room
    socket.on('leave_workspace', (workspaceId: string) => {
      socket.leave(workspaceId);
      console.log(`Socket ${socket.id} left workspace ${workspaceId}`);
    });

    // Join specific project room
    socket.on('join_project', (projectId: string) => {
      socket.join(`project_${projectId}`);
      console.log(`Socket ${socket.id} joined project ${projectId}`);
    });

    // Leave specific project room
    socket.on('leave_project', (projectId: string) => {
      socket.leave(`project_${projectId}`);
      console.log(`Socket ${socket.id} left project ${projectId}`);
    });

    // Typings indicator
    socket.on('typing', ({ projectId, userId, name }) => {
      socket.to(`project_${projectId}`).emit('typing', { userId, name });
    });

    socket.on('stop_typing', ({ projectId, userId }) => {
      socket.to(`project_${projectId}`).emit('stop_typing', { userId });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
