import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from "./styles";
import { AppTextInput } from '@/app/components/AppTextInput';
import { AppButton } from '@/app/components/AppButton';
import { AppText } from '@/app/components/AppText';
import { StackParamList } from '@/app/types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { auth } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export type NewRecipeScreenProps = NativeStackScreenProps<StackParamList, "Login">;

export const LoginScreen = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in, navigate to a different screen
        console.log('User logged in:', user);
      }
    });

    return unsubscribe;
  }, []);

  const handlePress = () => {
    setShowLogin(!showLogin);
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setError(null); // Clear any previous errors
      console.log('User logged in:', userCredential.user);
      // Implement logic to navigate after successful login
    } catch (error) {
      setError(error.message);
      console.error('Login error:', error);
    }
  };
  
  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setError(null); // Clear any previous errors
      console.log('User signed up:', userCredential.user);
      // Implement logic to navigate after successful signup
    } catch (error) {
      setError(error.message);
      console.error('Signup error:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {showLogin ? (
          <AppText style={styles.title}>Welcome Back!</AppText>
        ) : (
          <AppText style={styles.title}>Hello There!</AppText>
        )}
      </View>

      <View style={styles.form}>
        {showLogin ? (
          <>
            <AppTextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <AppTextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <AppText style={styles.forgotPasswordText}>Forgot password?</AppText>
            </TouchableOpacity>
            <AppButton title="Login" style={styles.loginButton} onPress={handleLogin} />
          </>
        ) : (
          <>
            <AppTextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <AppTextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
            />
            <AppTextInput
              style={styles.input}
              placeholder="Repeat Password"
              secureTextEntry={true}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
            <AppButton title="Sign Up" style={styles.signupButton} onPress={handleSignup} />
          </>
        )}
      </View>
      
      <View style={styles.switch}>
        <Text style={styles.switchText}>
          {showLogin ? 'New here? ' : 'Already have an account? '}
        </Text>
        <TouchableOpacity onPress={handlePress}>
          <AppText style={styles.switchLink}>{showLogin ? 'Sign Up' : 'Sign In'}</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};