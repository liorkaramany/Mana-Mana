import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  DocumentReference,
  collection,
  doc,
  getDocFromServer,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { converter } from "../firebase/utilities";
import { uriToBlob } from "../utilities";

export type UserDetails = {
  id: string;
  email: string;
  name: string;
  image: string | null;
};

export class UserNotFoundError extends Error {
  constructor(id: string) {
    super(`User with id: [ ${id} ] was not found.`);
  }
}

const usersConverter = converter<UserDetails>();

const usersCollection = collection(db, "users").withConverter(usersConverter);

const signUpUser = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await setDoc(doc(usersCollection, userCredential.user.uid), {
    id: userCredential.user.uid,
    name: email.match(/^([^@]*)@/)?.[1] ?? email,
    image: null,
    email,
  } satisfies UserDetails);

  return userCredential;
};

const signInUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

const signOutUser = async () => {
  await signOut(auth);
};

const findUserSnapById = async (id: string) => {
  const documentReference = doc(usersCollection, id);

  const userSnap = await getDocFromServer(documentReference);

  if (!userSnap.exists()) {
    throw new UserNotFoundError(id);
  }

  return userSnap;
};

const findUserDetailsById = async (id: string): Promise<UserDetails> => {
  return (await findUserSnapById(id)).data();
};

const updateUserImage = async (
  userDetailsReference: DocumentReference<UserDetails, UserDetails>,
  image: string
) => {
  const imageReference = ref(
    storage,
    `users/images/${userDetailsReference.id}`
  );
  const imageBlob = await uriToBlob(image);
  const result = await uploadBytes(imageReference, imageBlob);
  const newImage = await getDownloadURL(result.ref);

  await updateDoc(userDetailsReference, { image: newImage });
};

const updateUser = async (
  id: string,
  userDetails: Partial<UserDetails>
): Promise<void> => {
  const userSnap = await findUserSnapById(id);

  await updateDoc(userSnap.ref, userDetails);

  if (userDetails.image != null) {
    await updateUserImage(userSnap.ref, userDetails.image);
  }
};

export { findUserDetailsById, signInUser, signOutUser, signUpUser, updateUser };
