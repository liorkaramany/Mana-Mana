import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { converter } from "../firebase/utilities";

export type User = {
  email: string;
  name: string;
  image: string | null;
};

export type UserWithoutEmail = Omit<User, "email">;

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User with id: [ ${id} ] was not found.`);
  }
}

const usersConverter = converter<User>();

const usersCollection = collection(db, "users").withConverter(usersConverter);

const signUpUser = async (
  email: string,
  password: string,
  user: UserWithoutEmail
): Promise<void> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await setDoc(doc(usersCollection, userCredential.user.uid), {
    ...user,
    email,
  } satisfies User);
};

const signInUser = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password);
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

export { findUserById, signInUser, signUpUser, updateUser };
