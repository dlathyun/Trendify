import React from "react";
import { shallow } from "enzyme";
import renderer from 'react-test-renderer';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, reactNativeLocalPersistence } from "firebase/auth"
import RegisterScreen from "../screens/RegisterScreen";
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
    const registerScreen = shallow(<RegisterScreen />);
    const component = registerScreen.dive();
	component.setState({email : "johndoe@gmail.com"});

	expect(component.state().email).toHaveLength(17);
});

it('Password able to receive inputs', () => {
    const registerScreen = shallow(<RegisterScreen />);
    const component = registerScreen.dive();
    component.setState({password : "12345"});

	expect(component.state().password).toHaveLength(5);
});

it('Empty email gives error message', async () => {
    // const mockCallback = jest.fn();
    // const registerScreen = render(<RegisterScreen handleSignUpFunc={mockCallback}/>);
    const registerScreen = render(<RegisterScreen />);
    // const component = registerScreen.dive();
    jest.spyOn(Alert, "alert");
    fireEvent.press(registerScreen.getByTestId('handleSignUpButton'));
    // component.find("registerScreen").find("handleSignUpButton").click();
    // component.setState({email : ""});
    // const spy = jest.spyOn(component, "handleSignUp");
    // await component.handleSignUp;
	// expect().toBeCalled();
    // expect(mockCallback).toBeCalled();
    expect(Alert.alert).toHaveBeenCalledWith("Email cannot be empty!");
});

it('Already registered email gives error message', async () => {
    const registerScreen = render(<RegisterScreen />);
    const emailInput = registerScreen.getByTestId("emailInput");
    const passwordInput = registerScreen.getByTestId("passwordInput");
    fireEvent.changeText(emailInput, "Danny@gmail.com");
    fireEvent.changeText(passwordInput, "Test123");
    jest.spyOn(Alert, "alert");
    fireEvent.press(registerScreen.getByTestId('handleSignUpButton'));
    await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('You already have an account!');
    });
});

it('Successful registration gives \'Registered!\' message', async () => {
    const registerScreen = render(<RegisterScreen />);
    const emailInput = registerScreen.getByTestId("emailInput");
    const passwordInput = registerScreen.getByTestId("passwordInput");
    let time = new Date().getTime().toString();
    fireEvent.changeText(emailInput, time + "@gmail.com");
    fireEvent.changeText(passwordInput, "Test123");
    jest.spyOn(Alert, "alert");
    fireEvent.press(registerScreen.getByTestId('handleSignUpButton'));
    await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Registered!');
    });
});