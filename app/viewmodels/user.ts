import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  UserDetails,
  findUserDetailsById,
  signInUser,
  signOutUser,
  signUpUser,
  updateUser,
} from "../models/user";

export const UserViewModel = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserDetais, setCurrentUserDetails] =
    useState<UserDetails | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);

      if (user == null) {
        setCurrentUserDetails(null);
      } else {
        try {
          const userDetails = await findDetailsById(user.uid);
          setCurrentUserDetails(userDetails);
        } catch (error) {
          setCurrentUserDetails(null);
          console.log("UserViewModel:", error);
        }
      }
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) =>
    await signUpUser(email, password);

  const signIn = async (email: string, password: string) =>
    await signInUser(email, password);

  const signOut = async () => await signOutUser();

  const findDetailsById = async (id: string) => await findUserDetailsById(id);

  const update = async (id: string, userDetails: Partial<UserDetails>) =>
    await updateUser(id, userDetails);

  return {
    currentUser,
    currentUserDetais,
    signUp,
    signIn,
    signOut,
    findDetailsById,
    update,
  };
};
