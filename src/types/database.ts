export type Book = {
  id: string;
  title: string;
  author: string;
  content?: string;
};

export type Note = {
  id: string;
  bookId: string;
  userId: string;
  content: string;
  createdAt: string;
};
