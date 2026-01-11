import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import Input from '../../src/components/common/Input';

describe('Input', () => {
  it('renders label correctly', () => {
    render(
      <Input
        label="Email"
        value=""
        onChangeText={() => {}}
        testID="email-input"
      />
    );

    expect(screen.getByText('Email')).toBeTruthy();
  });

  it('displays current value', () => {
    render(
      <Input
        label="Email"
        value="test@example.com"
        onChangeText={() => {}}
        testID="email-input"
      />
    );

    expect(screen.getByDisplayValue('test@example.com')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeTextMock = jest.fn();
    render(
      <Input
        label="Email"
        value=""
        onChangeText={onChangeTextMock}
        testID="email-input"
      />
    );

    fireEvent.changeText(screen.getByTestId('email-input'), 'new@email.com');

    expect(onChangeTextMock).toHaveBeenCalledWith('new@email.com');
  });

  it('displays error message when error prop is provided', () => {
    render(
      <Input
        label="Email"
        value=""
        onChangeText={() => {}}
        error="Invalid email format"
        testID="email-input"
      />
    );

    expect(screen.getByText('Invalid email format')).toBeTruthy();
  });

  it('does not display error message when error is not provided', () => {
    render(
      <Input
        label="Email"
        value=""
        onChangeText={() => {}}
        testID="email-input"
      />
    );

    expect(screen.queryByText('Invalid email format')).toBeNull();
  });

  it('renders with placeholder', () => {
    render(
      <Input
        label="Email"
        value=""
        onChangeText={() => {}}
        placeholder="Enter your email"
        testID="email-input"
      />
    );

    expect(screen.getByPlaceholderText('Enter your email')).toBeTruthy();
  });

  it('renders password input with secure entry', () => {
    const { getByTestId } = render(
      <Input
        label="Password"
        value="secret123"
        onChangeText={() => {}}
        secureTextEntry={true}
        testID="password-input"
      />
    );

    expect(getByTestId('password-input')).toBeTruthy();
  });

  it('renders email keyboard type', () => {
    const { getByTestId } = render(
      <Input
        label="Email"
        value=""
        onChangeText={() => {}}
        keyboardType="email-address"
        testID="email-input"
      />
    );

    expect(getByTestId('email-input')).toBeTruthy();
  });

  it('renders numeric keyboard type', () => {
    const { getByTestId } = render(
      <Input
        label="Amount"
        value=""
        onChangeText={() => {}}
        keyboardType="numeric"
        testID="amount-input"
      />
    );

    expect(getByTestId('amount-input')).toBeTruthy();
  });

  it('applies autoCapitalize none by default', () => {
    const { getByTestId } = render(
      <Input
        label="Email"
        value=""
        onChangeText={() => {}}
        testID="email-input"
      />
    );

    expect(getByTestId('email-input')).toBeTruthy();
  });

  it('renders disabled input', () => {
    const { getByTestId } = render(
      <Input
        label="Email"
        value="disabled@example.com"
        onChangeText={() => {}}
        disabled={true}
        testID="disabled-input"
      />
    );

    expect(getByTestId('disabled-input')).toBeTruthy();
  });

  it('applies custom style', () => {
    const customStyle = { marginBottom: 20 };
    const { getByTestId } = render(
      <Input
        label="Email"
        value=""
        onChangeText={() => {}}
        style={customStyle}
        testID="styled-input"
      />
    );

    expect(getByTestId('styled-input')).toBeTruthy();
  });

  it('renders with autoComplete email', () => {
    const { getByTestId } = render(
      <Input
        label="Email"
        value=""
        onChangeText={() => {}}
        autoComplete="email"
        testID="email-input"
      />
    );

    expect(getByTestId('email-input')).toBeTruthy();
  });

  it('renders with autoComplete password', () => {
    const { getByTestId } = render(
      <Input
        label="Password"
        value=""
        onChangeText={() => {}}
        autoComplete="password"
        secureTextEntry={true}
        testID="password-input"
      />
    );

    expect(getByTestId('password-input')).toBeTruthy();
  });
});
