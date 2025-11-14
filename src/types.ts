export type Book = {
  id: number;
  title: string;
  author: string;
  year: number | null;
  genre: string | null;
  available: boolean;
};

export type Member = {
  id: number;
  name: string;
  address: string | null;
  city: string | null;
  phone: string | null;
};
