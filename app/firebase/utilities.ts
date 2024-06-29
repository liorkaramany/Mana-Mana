import { FirebaseError } from "firebase/app";
import { QueryDocumentSnapshot } from "firebase/firestore";

export const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

export const authErrorToString = (error: FirebaseError) => {
  const capitalize = (content: string) => {
    return content.charAt(0).toUpperCase() + content.slice(1);
  };

  return capitalize(error.code.slice("auth/".length).split("-").join(" "));
};
