import { useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import { initializeDatabase, saveCachedRecipe, deleteCachedRecipe } from './index';

const synchronizeRecipesWithFirestore = () => {
  useEffect(() => {
    console.log("keren1");
    const unsubscribe = firestore()
      .collection('recipes')
      .onSnapshot(async (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
            console.log("keren2");
          const recipeId = change.doc.id;
          const recipeData = change.doc.data();

          if (change.type === 'added' || change.type === 'modified') {
            await saveCachedRecipe(recipeId, recipeData);
          }

          if (change.type === 'removed') {
            await deleteCachedRecipe(recipeId);
          }
        });
      });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);
};

export default synchronizeRecipesWithFirestore;
