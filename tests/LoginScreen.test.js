import React from "react";
import { shallow } from "enzyme";
import renderer from 'react-test-renderer';
import { Alert } from 'react-native';
import { screen, render, fireEvent, waitFor } from '@testing-library/react-native'
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, reactNativeLocalPersistence } from "firebase/auth"
import LoginScreen from "../screens/LoginScreen";
// import App from "./../App.js";
// import app from './../firebaseConfig.js';
import Enzyme from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import { getByTestId } from "@testing-library/dom";

Enzyme.configure({ adapter: new Adapter() });

const firebaseConfig = {
    apiKey: "AIzaSyBzU9tkSn8eggJwWY9eoGUEscBka6kFTbA",
    authDomain: "orbital-final-final.firebaseapp.com",
    projectId: "orbital-final-final",
    storageBucket: "orbital-final-final.appspot.com",
    messagingSenderId: "456824775210",
    appId: "1:456824775210:web:5af16587b90bb4f37c9953",
    measurementId: "G-677T0CZ3V1"
  };

const app = initializeApp(firebaseConfig);

if (getApps().length < 1) { 
    initializeAuth(app,
      {
        persistence: reactNativeLocalPersistence
      }
    )
  }

it('Email able to receive inputs', () => {
    const loginScreen = shallow(<LoginScreen />);
    const component = loginScreen.dive();
	component.setState({email : "johndoe@gmail.com"});

	expect(component.state().email).toHaveLength(17);
});

it('Password able to receive inputs', () => {
    const loginScreen = shallow(<LoginScreen />);
    const component = loginScreen.dive();
    component.setState({password : "12345"});

	expect(component.state().password).toHaveLength(5);
});

it('Empty email gives error message', async () => {
    // const mockCallback = jest.fn();
    // const registerScreen = render(<RegisterScreen handleSignUpFunc={mockCallback}/>);
    const loginScreen = render(<LoginScreen />);
    // const component = registerScreen.dive();
    jest.spyOn(Alert, "alert");
    fireEvent.press(loginScreen.getByTestId('handleSignInButton'));
    // component.find("registerScreen").find("handleSignUpButton").click();
    // component.setState({email : ""});
    // const spy = jest.spyOn(component, "handleSignUp");
    // await component.handleSignUp;
	// expect().toBeCalled();
    // expect(mockCallback).toBeCalled();
    expect(Alert.alert).toHaveBeenCalledWith("Email cannot be empty!");
});

it('Not registered email gives error message', async () => {
    const loginScreen = render(<LoginScreen />);
    const emailInput = loginScreen.getByTestId("emailInput");
    const passwordInput = loginScreen.getByTestId("passwordInput");
    fireEvent.changeText(emailInput, "testing123@gmail.com");
    fireEvent.changeText(passwordInput, "Test123");
    jest.spyOn(Alert, "alert");
    fireEvent.press(loginScreen.getByTestId('handleSignInButton'));
    await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Create an account first!');
    });
});

it('Wrong password gives error message', async () => {
    const loginScreen = render(<LoginScreen />);
    const emailInput = loginScreen.getByTestId("emailInput");
    const passwordInput = loginScreen.getByTestId("passwordInput");
    fireEvent.changeText(emailInput, "Danny@gmail.com");
    fireEvent.changeText(passwordInput, "wrongPassword");
    jest.spyOn(Alert, "alert");
    fireEvent.press(loginScreen.getByTestId('handleSignInButton'));
    await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Wrong password!');
    });
});

// it('Successful login gives message', async () => {
//     const loginScreen = render(<LoginScreen />);
//     const emailInput = loginScreen.getByTestId("emailInput");
//     const passwordInput = loginScreen.getByTestId("passwordInput");
//     fireEvent.changeText(emailInput, "Danny@gmail.com");
//     fireEvent.changeText(passwordInput, "Test123");
//     fireEvent.press(loginScreen.getByTestId('handleSignInButton'));
//         console.log("LOGIN");
//         jest.useFakeTimers();
//             setTimeout(() => {
//             expect(screen.findByTestId("homeScreen")).toBeVisible();
//         }, 5000);
//         jest.runAllTimers();
// });