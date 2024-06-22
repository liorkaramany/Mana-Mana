import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { findRecipeById } from "../../models/recipe";
import { styles } from "./styles";
import { AppText } from '@/app/components/AppText';
import { ScrollView } from 'react-native';
import { auth } from '@/app/firebase';

export const ViewRecipe = ({ route }) => {
  const [recipe, setRecipe] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = auth;


  useEffect(() => {
    const { recipeId } = route.params;

    const fetchRecipe = async () => {
      try {
        setIsLoading(true);
        const fetchedRecipe = await findRecipeById(recipeId);
        setRecipe(fetchedRecipe);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipe();
  }, []);

  const { author, title, tags, ingredients, instructions } = recipe;

  const handleEditPress = () => {
  };

  const handleDeletePress = async () => {
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <Text>Loading recipe...</Text>}
      {error && <Text>Error: {error.message}</Text>}
      {recipe && (
        <>
          <View style={styles.header}>
            <AppText style={styles.title}>{title}</AppText>
            {currentUser?.uid === author && ( // Check for current user
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleEditPress} style={styles.button}>
                  <MaterialCommunityIcons name="pencil" size={30} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeletePress} style={styles.button}>
                  <MaterialCommunityIcons name="delete" size={30} color="red" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <ScrollView style={styles.content}>
            {/* Remaining recipe details */}
            <Image source={{ uri: recipe.image }} style={styles.image} />
            <View style={styles.details}>
              <View style={styles.tags}>
                {tags &&
                  tags.map((tag, index) => (
                    <AppText key={index} style={styles.tag}>
                      {tag}
                    </AppText>
                  ))}
              </View>
              <AppText style={styles.heading}>Ingredients:</AppText>
              {ingredients && (
                <View style={styles.ingredients}>
                  {ingredients.map((ingredient, index) => (
                    <AppText key={index} style={styles.ingredient}>
                      {ingredient.name} - {ingredient.amount}
                    </AppText>
                  ))}
                </View>
              )}
              <AppText style={styles.heading}>Instructions:</AppText>
              {instructions && (
                <View style={styles.instructions}>
                  {instructions.map((step, index) => (
                    <AppText key={index} style={styles.instruction}>
                      {step}
                    </AppText>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};