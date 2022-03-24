import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedbackBase,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../Context";



// Login screen
function LoginScreen({ navigation }) {
  // Keeps track of what the user has inputted
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [failedLogin, setFailedLogin] = useState(false);

  // Sign in method from context to allow us to login
  const { signIn } = React.useContext(AuthContext);

  return (
    // Main container
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        {/* Soundlink logo */}
        <Image
          style={styles.image}
          resizeMethod="resize"
          resizeMode="contain"
          source={require("../assets/images/soundlinklogo.png")}
        />

        <StatusBar style="auto" />
        {/* Username input field */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Username"
            placeholderTextColor="white"
            clearButtonMode="while-editing"
            selectionColor={"#573C6B"}
            showSoftInputOnFocus={true}
            onChangeText={(username) => setUsername(username)}
          />
        </View>

        {/* Password input field */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="white"
            clearButtonMode="while-editing"
            selectionColor={"#573C6B"}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        {/* Forgot Password prompt text */}
        <View style={styles.forgotView}>
          <Text style={styles.forgotText}>
            Forgot your password?{" "}
            <Text
              //onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.clickableText}
            >
              Click Here!
            </Text>
          </Text>
        </View>

        {/* Login button */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={async () => setFailedLogin(await signIn(username, password))}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* Conditionally renders error message if user enteres invalid login credentials */}
        {failedLogin ? (
          <Text style={styles.errorText}>Invalid Username or Password</Text>
        ) : (
          <Text></Text>
        )}

        {/* Register prompt text */}
        <View style={styles.signUpView}>
          <Text style={styles.signUpText}>
            Don't have an account?{" "}
            <Text
              onPress={() => navigation.navigate("Register")}
              style={styles.clickableText}
            >
              Sign Up Here!
            </Text>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Register screen
function RegisterScreen({ navigation }) {
  // Keeps track of what the user has inputted
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [registerState, setRegisterState] = useState("");
  const { signUp } = React.useContext(AuthContext);

  function verifyRegisterData(username, email, password, confirmPassword)
  {
    if (username === "")
      return "Username field must be filled"
    else if (username.length < 4)
      return "Username is too short (At least 3 characters)"
    else if (email === "")
      return "Email field must be filled"
    else if (!verifyEmailFormat(email)) 
      return "Email format is invalid"
    else if (password === "")
      return "Password field must be filled"
    else if(password !== confirmPassword)
      return "Passwords do not match"
    else
      signUp("", "", email, "", username, password, "")
      return "Verified"
  }
  function verifyEmailFormat(email) //verifies format of string@string.string
  {
    var reg = /\S+@\S+\.\S+/;
    return reg.test(email);
  }

  return (
    // Pushes content up when keyboard is blocking it
    // Main container
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {/* // Main container */}
      <View style={styles.container}>
        {/* Soundlink logo */}
        <Image
          style={styles.image}
          resizeMethod="resize"
          resizeMode="contain"
          source={require("../assets/images/soundlinklogo.png")}
        />

        <StatusBar style="auto" />
        {/* Username input field */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Username"
            placeholderTextColor="white"
            clearButtonMode="while-editing"
            selectionColor={"#573C6B"}
            onChangeText={(username) => setUsername(username)}
          />
        </View>
        {/* Email Address input field */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email Address"
            placeholderTextColor="white"
            clearButtonMode="while-editing"
            selectionColor={"#573C6B"}
            autoCompleteType="email"
            onChangeText={(email) => setEmail(email)}
          />
        </View>

        {/* Password input field */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="white"
            clearButtonMode="while-editing"
            selectionColor={"#573C6B"}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>

        {/* Confirm Password input field */}
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Confirm Password"
            placeholderTextColor="white"
            clearButtonMode="while-editing"
            selectionColor={"#573C6B"}
            secureTextEntry={true}
            onChangeText={(confirmPassword) =>
              setConfirmPassword(confirmPassword)
            }
          />
        </View>


        {/* Register button */}
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={async () => setRegisterState(await verifyRegisterData(
              username,
              email,
              password,
              confirmPassword
            ))
          }
        >
          <Text style={styles.loginText}>Register</Text>
        </TouchableOpacity>

        {/* Conditionally renders error message if user enteres invalid login credentials */}
        {registerState === "Verified" ? (
        <Text></Text>
        ) : (
        <Text style={styles.errorText}>{registerState}</Text>
        )}

        {/* Back to login */}
        <View style={styles.backToLoginView}>
          <Text
            onPress={() => navigation.navigate("Login")}
            style={styles.signUpText}
          >
            Already have an account?{" "}
            <Text style={styles.clickableText}>Login</Text>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

// Navigation between login and register screens
function UnauthenticatedScreen() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export default UnauthenticatedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#23192B",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    marginTop: 50,
    marginBottom: 30,
    height: 160,
    width: 200,
  },

  inputView: {
    backgroundColor: "black",
    borderWidth: 1,
    borderRadius: 30,
    borderColor: "#573C6B",
    width: "75%",
    height: 45,
    marginBottom: 20,
  },

  spacer: {
    height: 30,
  },

  forgotView: {
    width: "60%",
    alignContent: "center",
    alignItems: "center",
  },

  forgotText: {
    marginBottom: 30,
    fontSize: 12,
    color: "white",
  },

  signUpView: {
    width: "60%",
    alignContent: "center",
    alignItems: "center",
  },

  backToLoginView: {
    width: "60%",
    alignContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },

  signUpText: {
    marginTop: 20,
    fontSize: 12,
    color: "white",
  },

  errorText: {
    marginTop: 10,
    color: "red",
  },

  clickableText: {
    fontSize: 12,
    color: "#A57FC1",
  },

  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
    color: "white",
  },

  loginBtn: {
    width: "70%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#573C6B",
  },

  loginText: {
    color: "white",
  },
});
