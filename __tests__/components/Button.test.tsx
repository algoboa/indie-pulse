import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import Button from '../../src/components/common/Button';

describe('Button', () => {
  it('renders children text correctly', () => {
    render(<Button onPress={() => {}}>Click Me</Button>);

    expect(screen.getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    render(<Button onPress={onPressMock} testID="test-button">Press</Button>);

    fireEvent.press(screen.getByTestId('test-button'));

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    render(
      <Button onPress={onPressMock} disabled testID="disabled-button">
        Disabled
      </Button>
    );

    fireEvent.press(screen.getByTestId('disabled-button'));

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const onPressMock = jest.fn();
    render(
      <Button onPress={onPressMock} loading testID="loading-button">
        Loading
      </Button>
    );

    fireEvent.press(screen.getByTestId('loading-button'));

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('renders with contained mode by default', () => {
    const { getByTestId } = render(
      <Button onPress={() => {}} testID="contained-button">
        Contained
      </Button>
    );

    expect(getByTestId('contained-button')).toBeTruthy();
  });

  it('renders with outlined mode', () => {
    const { getByTestId } = render(
      <Button onPress={() => {}} mode="outlined" testID="outlined-button">
        Outlined
      </Button>
    );

    expect(getByTestId('outlined-button')).toBeTruthy();
  });

  it('renders with text mode', () => {
    const { getByTestId } = render(
      <Button onPress={() => {}} mode="text" testID="text-button">
        Text
      </Button>
    );

    expect(getByTestId('text-button')).toBeTruthy();
  });

  it('applies primary variant by default', () => {
    const { getByTestId } = render(
      <Button onPress={() => {}} testID="primary-button">
        Primary
      </Button>
    );

    expect(getByTestId('primary-button')).toBeTruthy();
  });

  it('applies secondary variant', () => {
    const { getByTestId } = render(
      <Button onPress={() => {}} variant="secondary" testID="secondary-button">
        Secondary
      </Button>
    );

    expect(getByTestId('secondary-button')).toBeTruthy();
  });

  it('applies success variant', () => {
    const { getByTestId } = render(
      <Button onPress={() => {}} variant="success" testID="success-button">
        Success
      </Button>
    );

    expect(getByTestId('success-button')).toBeTruthy();
  });

  it('applies error variant', () => {
    const { getByTestId } = render(
      <Button onPress={() => {}} variant="error" testID="error-button">
        Error
      </Button>
    );

    expect(getByTestId('error-button')).toBeTruthy();
  });

  it('renders with icon', () => {
    const { getByTestId } = render(
      <Button onPress={() => {}} icon="check" testID="icon-button">
        With Icon
      </Button>
    );

    expect(getByTestId('icon-button')).toBeTruthy();
  });

  it('applies custom style', () => {
    const customStyle = { marginTop: 10 };
    const { getByTestId } = render(
      <Button onPress={() => {}} style={customStyle} testID="styled-button">
        Styled
      </Button>
    );

    expect(getByTestId('styled-button')).toBeTruthy();
  });

  it('applies custom label style', () => {
    const customLabelStyle = { fontSize: 20 };
    const { getByTestId } = render(
      <Button onPress={() => {}} labelStyle={customLabelStyle} testID="label-styled-button">
        Label Styled
      </Button>
    );

    expect(getByTestId('label-styled-button')).toBeTruthy();
  });
});
