import prisma from '../../../prisma/prisma-client';
import { Tag } from './tag.model';

const getTags = async (): Promise<string[]> => {
  // Lấy 10 thẻ có số lượng bài viết đính kèm nhiều nhất toàn hệ thống
  const tags = await prisma.tag.findMany({
    where: {
      articles: {
        some: {} // Chỉ lấy những tag đã có ít nhất 1 bài viết sử dụng
      }
    },
    select: {
      name: true,
    },
    orderBy: {
      articles: {
        _count: 'desc',
      },
    },
    take: 10,
  });

  return tags.map((tag: Tag) => tag.name);
};

export default getTags;