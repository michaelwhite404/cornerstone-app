import axios from "axios";
import { TextbookSetModel } from "../types/models/textbookSetTypes";
import { TextbookModel } from "../types/models/textbookTypes";
import Prebook from "../types/Prebook";

export default function useTextbook() {
  type CheckoutData = { book: string; student: string };
  const checkoutTextbook = async (data: CheckoutData[]) => {
    const res = await axios.post("/api/v2/textbooks/books/check-out", {
      data,
    });
    return res.data.message as string;
  };

  type CheckinData = { id: string; quality: string };
  const checkinTextbook = async (data: CheckinData[]) => {
    const res = await axios.patch("/api/v2/textbooks/books/check-in", {
      books: data,
    });
    return res.data.message as string;
  };

  type CreateSetAndBooksData = {
    title: string;
    class: string;
    grade: number | string;
    books: Prebook[];
  };
  const createSetAndBooks = async (data: CreateSetAndBooksData) => {
    const res = await axios.post("/api/v2/textbooks/books/both", { ...data });
    return res.data.data as { textbook: TextbookSetModel; books: TextbookModel[] };
  };

  return { checkoutTextbook, checkinTextbook, createSetAndBooks };
}
