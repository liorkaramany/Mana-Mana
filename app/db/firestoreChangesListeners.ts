import { collectionGroup, onSnapshot } from 'firebase/firestore';
import { FullRecipe } from '../models/recipe';
import { UserDetails } from '../models/user';
import { deleteCachedRecipe, deleteCachedUser, saveCachedRecipe, saveCachedUserDetails } from '.';
import { db } from '../firebase';

type SnapshotListenerCallback = (error?: Error | null) => void;

const listenForRecipesChanges = (callback: SnapshotListenerCallback) => {
  // Subscribe to real-time updates
  onSnapshot(collectionGroup(db, "recipes"), (snapshot) => {
    snapshot.docChanges().forEach(change => {
      const recipe = change.doc.data() as FullRecipe;
      const recipeId = change.doc.id;

      switch (change.type) {
        case 'added':
        case 'modified':
          // Update or add to SQLite cache
          console.log("modified or added");
          saveCachedRecipe(recipeId, recipe);
          break;
        case 'removed':
          // Remove from SQLite cache
          console.log("removed");
          deleteCachedRecipe(recipeId);
          break;
        default:
          break;
      }
    });

    if (callback) {
      callback(null);
    }
  }, error => {
    console.error('Error listening for recipes changes:', error);
    if (callback) {
      callback(error);
    }
  });
};

const listenForUsersChanges = (callback: SnapshotListenerCallback) => {
  // Subscribe to real-time updates
  onSnapshot(collectionGroup(db, "users"), (snapshot) => {
    snapshot.docChanges().forEach(change => {
      const user = change.doc.data() as UserDetails;
      const userId = change.doc.id;

      switch (change.type) {
        case 'added':
        case 'modified':
          // Update or add to SQLite cache
          console.log("modified or added");
          saveCachedUserDetails(userId, user);
          break;
        case 'removed':
          // Remove from SQLite cache
          console.log("removed");
          deleteCachedUser(userId);
          break;
        default:
          break;
      }
    });

    if (callback) {
      callback(null);
    }
  }, error => {
    console.error('Error listening for users changes:', error);
    if (callback) {
      callback(error);
    }
  });
};

export { listenForRecipesChanges, listenForUsersChanges };
