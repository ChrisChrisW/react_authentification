import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";

import Spinner from "react-native-loading-spinner-overlay";
import jwt_decode from "jwt-decode"; // https://www.npmjs.com/package/jwt-decode

import APIKit, { setClientToken } from "../Api/APIKit";

const initialState = {
  username: "",
  password: "",
  errors: {},
  isAuthorized: false,
  isLoading: false,
  token: "",
};

class Login extends Component {
  state = initialState;

  componentWillUnmount() {}

  onUsernameChange = (username) => {
    this.setState({ username });
  };

  onPasswordChange = (password) => {
    this.setState({ password });
  };

  onPressLogin() {
    const { username, password } = this.state;
    const payload = { username, password };
    console.log(payload); // data username and password

    const onSuccess = ({ data }) => {
      // Set JSON Web Token on success
      setClientToken(data.token);
      this.setState({
        isLoading: false,
        isAuthorized: true,
        token: data.token,
      });
      //console.log(data.token);
    };

    const onFailure = (error) => {
      console.log(error && error.response);
      this.setState({ errors: error.response.data, isLoading: false });
    };

    // Show spinner when call is made
    this.setState({ isLoading: true });

    // Post data
    APIKit.post("/login", payload).then(onSuccess).catch(onFailure);
  }

  getNonFieldErrorMessage() {
    // Return errors that are served in `non_field_errors`
    let message = null;
    const { errors } = this.state;
    if (errors.non_field_errors) {
      message = (
        <View style={styles.errorMessageContainerStyle}>
          {errors.non_field_errors.map((item) => (
            <Text style={styles.errorMessageTextStyle} key={item}>
              {item}
            </Text>
          ))}
        </View>
      );
    }
    return message;
  }

  getErrorMessageByField(field) {
    // Checks for error message in specified field
    // Shows error message from backend
    let message = null;
    if (this.state.errors[field]) {
      message = (
        <View style={styles.errorMessageContainerStyle}>
          {this.state.errors[field].map((item) => (
            <Text style={styles.errorMessageTextStyle} key={item}>
              {item}
            </Text>
          ))}
        </View>
      );
    }
    return message;
  }

  onProfile() {
    const token = this.state.token;
    if (!token) return;

    const decoded = jwt_decode(token); // decode jwt content
    console.log(decoded);

    const decodedHeader = jwt_decode(token, { header: true }); // decode jwt header
    console.log(decodedHeader);
  }

  onGet() {
    APIKit.get("/users")
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  }

  onPost() {
    const postData = {
      title: "Whale done posts",
      summary: "Post test",
      content: "Texte alternative",
      tags: [{ name: "bien etre" }],
    }; // the data
    //APIKit.put("/posts/n", postData)
    //APIKit.delete("/posts/n")
    APIKit.post("/posts", postData)
      .then((response) => console.log(response))
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  }

  render() {
    const { isLoading } = this.state;

    return (
      <View style={styles.containerStyle}>
        <Spinner visible={isLoading} />

        {!this.state.isAuthorized ? (
          <View>
            <View style={styles.logotypeContainer}>
              <Image
                source={require("../../assets/icon.png")}
                style={styles.logotype}
              />
            </View>

            <TextInput
              style={styles.input}
              value={this.state.username}
              maxLength={256}
              placeholder="Entrer votre identifiant..."
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={(event) =>
                this.passwordInput.wrappedInstance.focus()
              }
              onChangeText={this.onUsernameChange}
              underlineColorAndroid="transparent"
              placeholderTextColor="#999"
            />

            {this.getErrorMessageByField("username")}

            <TextInput
              ref={(node) => {
                this.passwordInput = node;
              }}
              style={styles.input}
              value={this.state.password}
              maxLength={40}
              placeholder="Entrer votre mot de passe..."
              onChangeText={this.onPasswordChange}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              blurOnSubmit
              onSubmitEditing={this.onPressLogin.bind(this)}
              secureTextEntry
              underlineColorAndroid="transparent"
              placeholderTextColor="#999"
            />

            {this.getErrorMessageByField("password")}

            {this.getNonFieldErrorMessage()}

            <TouchableOpacity
              style={styles.loginButton}
              onPress={this.onPressLogin.bind(this)}
            >
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text>Successfully authorized!</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => this.onProfile()}
            >
              <Text style={styles.loginButtonText}>Get token</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

// Define some colors and default sane values
const utils = {
  colors: { primaryColor: "#af0e66" },
  dimensions: { defaultPadding: 12 },
  fonts: { largeFontSize: 18, mediumFontSize: 16, smallFontSize: 12 },
};

// Define styles here
const styles = {
  innerContainer: {
    marginBottom: 32,
  },
  logotypeContainer: {
    alignItems: "center",
  },
  logotype: {
    maxWidth: 280,
    maxHeight: 100,
    resizeMode: "contain",
    alignItems: "center",
  },
  containerStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6f6f6",
  },
  input: {
    height: 50,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    marginBottom: utils.dimensions.defaultPadding,
  },
  loginButton: {
    borderColor: utils.colors.primaryColor,
    borderWidth: 2,
    padding: utils.dimensions.defaultPadding,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  loginButtonText: {
    color: utils.colors.primaryColor,
    fontSize: utils.fonts.mediumFontSize,
    fontWeight: "bold",
  },
  errorMessageContainerStyle: {
    marginBottom: 8,
    backgroundColor: "#fee8e6",
    padding: 8,
    borderRadius: 4,
  },
  errorMessageTextStyle: {
    color: "#db2828",
    textAlign: "center",
    fontSize: 12,
  },
};

export default Login;
