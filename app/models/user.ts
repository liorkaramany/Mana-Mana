import { QueryDocumentSnapshot, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

export type User = {
  name: string | null;
  uid: string;
  image: string | null;
};

const usersConverter = {
  toFirestore: (data: User) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as User,
};

const usersCollecetion = collection(db, "users").withConverter(
  usersConverter
);

const createUser = async (user: User): Promise<void> => {
  const userDocument = await addDoc(usersCollecetion, user);
};

export { createUser };
