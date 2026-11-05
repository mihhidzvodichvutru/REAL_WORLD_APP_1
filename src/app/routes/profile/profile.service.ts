// import prisma from '../../../prisma/prisma-client';
// import profileMapper from './profile.utils';
// import HttpException from '../../models/http-exception.model';

// export const getProfile = async (usernamePayload: string, id?: number) => {
//   const profile = await prisma.user.findUnique({
//     where: {
//       username: usernamePayload,
//     },
//     include: {
//       followedBy: true,
//     },
//   });

//   if (!profile) {
//     throw new HttpException(404, {});
//   }

//   return profileMapper(profile, id);
// };

// export const followUser = async (usernamePayload: string, id: number) => {
//   const profile = await prisma.user.update({
//     where: {
//       username: usernamePayload,
//     },
//     data: {
//       followedBy: {
//         connect: {
//           id,
//         },
//       },
//     },
//     include: {
//       followedBy: true,
//     },
//   });

//   return profileMapper(profile, id);
// };

// export const unfollowUser = async (usernamePayload: string, id: number) => {
//   const profile = await prisma.user.update({
//     where: {
//       username: usernamePayload,
//     },
//     data: {
//       followedBy: {
//         disconnect: {
//           id,
//         },
//       },
//     },
//     include: {
//       followedBy: true,
//     },
//   });

//   return profileMapper(profile, id);
// };
import prisma from '../../../prisma/prisma-client';
import profileMapper from './profile.utils';
import HttpException from '../../models/http-exception.model';

export const getProfile = async (usernamePayload: string, id?: number) => {
  const profile = await prisma.user.findUnique({
    where: {
      username: usernamePayload,
    },
    include: {
      followedBy: true,
    },
  });

  if (!profile) {
    throw new HttpException(404, {});
  }

  return profileMapper(profile, id);
};

export const followUser = async (usernamePayload: string, id: number) => {
  // 1. Kiểm tra user muốn follow có tồn tại không
  const targetUser = await prisma.user.findUnique({
    where: { username: usernamePayload },
  });

  if (!targetUser) {
    throw new HttpException(404, {});
  }

  // 2. Tồn tại thì mới thực hiện update (connect)
  const profile = await prisma.user.update({
    where: {
      username: usernamePayload,
    },
    data: {
      followedBy: {
        connect: {
          id,
        },
      },
    },
    include: {
      followedBy: true,
    },
  });

  return profileMapper(profile, id);
};

export const unfollowUser = async (usernamePayload: string, id: number) => {
  // 1. Kiểm tra user muốn unfollow có tồn tại không
  const targetUser = await prisma.user.findUnique({
    where: { username: usernamePayload },
  });

  if (!targetUser) {
    throw new HttpException(404, {});
  }

  // 2. Tồn tại thì mới thực hiện update (disconnect)
  const profile = await prisma.user.update({
    where: {
      username: usernamePayload,
    },
    data: {
      followedBy: {
        disconnect: {
          id,
        },
      },
    },
    include: {
      followedBy: true,
    },
  });

  return profileMapper(profile, id);
};
