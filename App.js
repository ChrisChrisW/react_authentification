// <ROOT>/App.js

import React from "react";

import {
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  StatusBar,
} from "react-native";

//import LoginView from "./App/Views/Login/LoginView";
import LoginView from "./src/screens/LoginView";

const App = () => {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} enabled>
      <StatusBar barStyle="dark-content" />

      <SafeAreaView style={styles.container}>
        <LoginView />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
});

export default App;
