import { AppButton } from "@/app/components/AppButton";
import { AppText } from "@/app/components/AppText";
import { AppTextInput } from "@/app/components/AppTextInput";
import { UserDetailsWithoutEmail } from "@/app/models/user";
import { StackParamList } from "@/app/types/navigation";
import { UserViewModel } from "@/app/viewmodels/user";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../firebase/firebase";
import styles from "./styles";
import { StackActions } from "@react-navigation/native";

type LoginScreenProps = NativeStackScreenProps<StackParamList, "Login">;

export const LoginScreen = (props: LoginScreenProps) => {
  const { navigation } = props;
  const [showLogin, setShowLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp } = UserViewModel();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in, navigate to home screen
        navigation.dispatch(StackActions.replace("Home"));
      }
    });

    return unsubscribe;
  }, []);

  const handlePress = () => {
    setShowLogin(!showLogin);
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signIn(email, password);
      setError(null); // Clear any previous errors
      console.log("User logged in:", userCredential.user);

      // Navigate to home screen
      navigation.dispatch(StackActions.replace("Home"));
    } catch (error) {
      setError((error as Error).message);
      console.error("Login error:", error);
    }
  };

  const handleSignup = async () => {
    try {
      const userCredential = await signUp(
        email,
        password,
        // TODO: Fill in the details
        {} as UserDetailsWithoutEmail
      );
      setError(null); // Clear any previous errors
      console.log("User signed up:", userCredential.user);

      // Navigate to home screen
      navigation.dispatch(StackActions.replace("Home"));
    } catch (error) {
      setError((error as Error).message);
      console.error("Signup error:", error);
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
              <AppText style={styles.forgotPasswordText}>
                Forgot password?
              </AppText>
            </TouchableOpacity>
            <AppButton
              title="Login"
              style={styles.loginButton}
              onPress={handleLogin}
            />
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
            <AppButton
              title="Sign Up"
              style={styles.signupButton}
              onPress={handleSignup}
            />
          </>
        )}
      </View>

      <View style={styles.switch}>
        <Text style={styles.switchText}>
          {showLogin ? "New here? " : "Already have an account? "}
        </Text>
        <TouchableOpacity onPress={handlePress}>
          <AppText style={styles.switchLink}>
            {showLogin ? "Sign Up" : "Sign In"}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};
