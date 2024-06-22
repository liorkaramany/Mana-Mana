import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { converter } from "../firebase/utilities";

export type UserDetails = {
  email: string;
  name: string;
  image: string | null;
};

export type UserDetailsWithoutEmail = Omit<UserDetails, "email">;

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User with id: [ ${id} ] was not found.`);
  }
}

const usersConverter = converter<UserDetails>();

const usersCollection = collection(db, "users").withConverter(usersConverter);

const signUpUser = async (
  email: string,
  password: string,
  userDetails: UserDetailsWithoutEmail
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await setDoc(doc(usersCollection, userCredential.user.uid), {
    ...userDetails,
    email,
  } satisfies UserDetails);

  return userCredential;
};

const signInUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

const findUserSnapById = async (id: string) => {
  const documentReference = doc(usersCollection, id);

  const userSnap = await getDoc(documentReference);

  if (!userSnap.exists()) {
    throw new UserNotFoundError(id);
  }

  return userSnap;
};

const findUserDetailsById = async (id: string): Promise<UserDetails> => {
  return (await findUserSnapById(id)).data();
};

const updateUser = async (
  id: string,
  userDetails: Partial<UserDetails>
): Promise<void> => {
  const userSnap = await findUserSnapById(id);

  await updateDoc(userSnap.ref, userDetails);
};

export { findUserDetailsById, signInUser, signUpUser, updateUser };