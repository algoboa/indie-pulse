// Extend Jest with react-native matchers
require('@testing-library/jest-native/extend-expect');

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    setItem: jest.fn((key, value) => {
      store[key] = value;
      return Promise.resolve();
    }),
    getItem: jest.fn((key) => {
      return Promise.resolve(store[key] || null);
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      store = {};
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => {
      return Promise.resolve(Object.keys(store));
    }),
    multiGet: jest.fn((keys) => {
      return Promise.resolve(keys.map((key) => [key, store[key] || null]));
    }),
    multiSet: jest.fn((keyValuePairs) => {
      keyValuePairs.forEach(([key, value]) => {
        store[key] = value;
      });
      return Promise.resolve();
    }),
    multiRemove: jest.fn((keys) => {
      keys.forEach((key) => delete store[key]);
      return Promise.resolve();
    }),
  };
});

// Mock react-native-toast-message
jest.mock('react-native-toast-message', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => null,
    show: jest.fn(),
    hide: jest.fn(),
  };
});

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const createIconMock = (name) => {
    return (props) => React.createElement(Text, props, props.name || name);
  };

  return {
    MaterialCommunityIcons: createIconMock('MaterialCommunityIcons'),
    MaterialIcons: createIconMock('MaterialIcons'),
    Ionicons: createIconMock('Ionicons'),
    FontAwesome: createIconMock('FontAwesome'),
    AntDesign: createIconMock('AntDesign'),
    Feather: createIconMock('Feather'),
  };
});

// Mock react-native-paper
jest.mock('react-native-paper', () => {
  const React = require('react');
  const RN = require('react-native');

  return {
    PaperProvider: ({ children }) => children,
    Button: ({ children, onPress, loading, disabled, testID }) => (
      React.createElement(RN.TouchableOpacity, {
        onPress: (disabled || loading) ? null : onPress,
        disabled: disabled || loading,
        testID,
        accessibilityState: { disabled: disabled || loading },
      }, loading
        ? React.createElement(RN.ActivityIndicator, null)
        : React.createElement(RN.Text, null, children)
      )
    ),
    TextInput: ({ label, value, onChangeText, error, testID, secureTextEntry, left, right, ...props }) => (
      React.createElement(RN.View, null,
        React.createElement(RN.Text, null, label),
        React.createElement(RN.TextInput, {
          value,
          onChangeText,
          testID,
          secureTextEntry,
          ...props,
        }),
        error && React.createElement(RN.Text, null, error)
      )
    ),
    HelperText: ({ children, visible }) => (
      visible ? React.createElement(RN.Text, null, children) : null
    ),
    Text: RN.Text,
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');

  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  const frame = { x: 0, y: 0, width: 375, height: 812 };

  return {
    SafeAreaProvider: ({ children }) => React.createElement(View, null, children),
    SafeAreaView: ({ children, style }) => React.createElement(View, { style }, children),
    SafeAreaInsetsContext: React.createContext(inset),
    SafeAreaFrameContext: React.createContext(frame),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => frame,
    initialWindowMetrics: {
      insets: inset,
      frame,
    },
  };
});

// Mock react-native-screens
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
  Screen: ({ children }) => children,
  ScreenContainer: ({ children }) => children,
}));

// Mock @react-navigation/elements
jest.mock('@react-navigation/elements', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  return {
    SafeAreaProviderCompat: ({ children }) => React.createElement(View, null, children),
    Header: () => null,
    HeaderBackButton: () => null,
    HeaderBackground: () => null,
    HeaderTitle: () => null,
    MissingIcon: () => null,
    PlatformPressable: ({ children, onPress }) => React.createElement(View, { onPress }, children),
    ResourceSavingView: ({ children }) => React.createElement(View, null, children),
    Screen: ({ children }) => React.createElement(View, null, children),
    getDefaultHeaderHeight: () => 64,
    getHeaderTitle: () => '',
    useHeaderHeight: () => 64,
  };
});

// Mock @react-navigation/native-stack
jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children, screenOptions }) => React.createElement(View, null, children),
      Screen: ({ component: Component, name }) => React.createElement(Component, { navigation: { navigate: jest.fn() } }),
    }),
  };
});

// Mock @react-navigation/bottom-tabs
jest.mock('@react-navigation/bottom-tabs', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    createBottomTabNavigator: () => ({
      Navigator: ({ children }) => React.createElement(View, null, children),
      Screen: ({ component: Component, name }) => React.createElement(Component, { navigation: { navigate: jest.fn() } }),
    }),
  };
});

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    NavigationContainer: ({ children }) => React.createElement(View, null, children),
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
    useFocusEffect: () => {},
    useIsFocused: () => true,
  };
});

// Global test timeout
jest.setTimeout(15000);
