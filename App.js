import React, {useState, useEffect} from 'react';
import Signin from './src/screens/Signin';
import auth from '@react-native-firebase/auth';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import Login from './src/screens/Login';

const Stack = createNativeStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="home" component={HomeScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="signin" component={Signin} />
          <Stack.Screen name="login" component={Login} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;
