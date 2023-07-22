import React from "react"

import { fireEvent, render, screen } from "@testing-library/react-native"
// import { act } from "react-test-renderer";
// import renderer from 'react-test-renderer';
import LoginScreen from "../screens/LoginScreen";
import { getByTestId } from "@testing-library/dom";
import AddPostScreen from "../screens/AddPostScreen";

// it('Successful adding of item', () => {
//     const {getByPlaceholderText, getByText, getAllByText} = render(
//         <AddPostScreen />,
//       );
//       const renderedComponent = render(<AddPostScreen />);
    
//       fireEvent.changeText(
//         renderedComponent.
//         getByPlaceholderText('Enter item type'),
//         'shirt',
//       );
//       fireEvent.press(renderedComponent.getByTestId('AddItem'));
    
//       const shirtElements = getAllByText('shirt');
//       expect(shirtElements).toHaveLength(1);
// })
//     const mockFn = jest.fn()
//     render(<LoginScreen />)

//     fireEvent.changeText(screen.getByPlaceholder('Email'), 'test@gmail.com')
//     fireEvent.changeText(screen.getByPlaceholder('Password'), '1234567890')
//     fireEvent.press(screen.getByTestId('LoginButton'))

//     expect(mockFn).toMatchSnapshot()
// })
// let fetch = require("jest-fetch-mock")



// it('Should log in successfully', async () => {
//     //fetch.mockResponseOnce(JSON.stringify({ passes: true }));
//     const {getByPlaceholder, getByText, getAllByText} = render(
//                 <LoginScreen />,
//               );

//     const pushMock = jest.fn();
//     const renderedComponent = render(<LoginScreen />);
    
//     fireEvent.changeText(renderedComponent.getByPlaceholder("Email"), "test@disc.com");
//     fireEvent.changeText(renderedComponent.getByPlaceholder("Password"), "test123");
//     fireEvent.press(renderedComponent.getByTestId("LoginButton"));

//     expect(fetch.mock.calls).toMatchSnapshot();
//     await act(flushMicrotasksQueue);

//     expect(pushMock).toBeCalledWith("App");
// })

// it('Should not log in with wrong password', async () => {
    
//     fetch.mockResponseOnce(JSON.stringify({ passes: true }));

//     const pushMock = jest.fn();
//     const renderedComponent = render(<Login />);
    
//     fireEvent.changeText(renderedComponent.getByPlaceholder("Email"), "test@disc.com");
//     fireEvent.changeText(renderedComponent.getByPlaceholder("Password"), "test321"); // actual password is test123
//     fireEvent.press(renderedComponent.getByTestId("Login.Button"));

//     expect(fetch.mock.calls).toMatchSnapshot();
//     await act(flushMicrotasksQueue);

//     expect(pushMock).not.toBeCalledWith("App");
// })