import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { converter } from "../firebase/utilities";

export type User = {
  name: string;
  image: string | null;
};

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User with id: [ ${id} ] was not found.`);
  }
}

const usersConverter = converter<User>();

const usersCollection = collection(db, "users").withConverter(usersConverter);

const createUser = async (id: string, user: User): Promise<void> => {
  await setDoc(doc(usersCollection, id), user);
};

const findUserSnapById = async (id: string) => {
  const documentReference = doc(usersCollection, id);

  const userSnap = await getDoc(documentReference);

  if (!userSnap.exists()) {
    throw new UserNotFoundError(id);
  }

  return userSnap;
};

const findUserById = async (id: string): Promise<User> => {
  return (await findUserSnapById(id)).data();
};

const updateUser = async (id: string, user: Partial<User>): Promise<void> => {
  const userSnap = await findUserSnapById(id);

  await updateDoc(userSnap.ref, user);
};

export { createUser, findUserById, updateUser };
