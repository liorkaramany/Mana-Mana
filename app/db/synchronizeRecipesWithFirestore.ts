import React, { useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { saveCachedRecipe, deleteCachedRecipe } from './index';

export const RecipeSynchronizer = () => {
  useEffect(() => {
    const synchronizeRecipesWithFirestore = async () => {
      console.log('Synchronizing recipes...');
      const unsubscribe = firestore()
        .collection('recipes')
        .onSnapshot(
          (snapshot) => {
            console.log('Snapshot changes:', snapshot.docChanges());
            snapshot.docChanges().forEach(async (change) => {
              const recipeId = change.doc.id;
              const recipeData = change.doc.data();

              console.log("Change type: " + change.type);

              if (change.type === 'added' || change.type === 'modified') {
                await saveCachedRecipe(recipeId, recipeData);
              }

              if (change.type === 'removed') {
                await deleteCachedRecipe(recipeId);
              }
            });
          },
          (error) => {
            console.error('Error in Firestore snapshot listener:', error);
          }
        );

      return () => unsubscribe();
    };

    synchronizeRecipesWithFirestore();
  }, []);

  return null;
};
