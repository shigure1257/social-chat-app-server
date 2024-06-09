export type PaginationRes = {
  total: number;
  totalPage: number;
  current: number;
  data: Array<
    {
      author: {
        username: string;
      };
    } & {
      id: string;
      title: string;
      content: string;
      type: string;
      category: string;
      published: boolean;
      authorId: number;
      createTime: Date;
      updateTime: Date;
    }
  >;
};
