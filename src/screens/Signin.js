import {View} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './pageStyles/signinStyles';
import {AccountTextComp, ButtonComp, Input} from '../components/Reuse';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const Signin = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  GoogleSignin.configure({
    webClientId:
      '773177856789-fuu3stu03ioqor912bdha5agpum02m9j.apps.googleusercontent.com',
  });

  const gotoLoginPage = () => {
    navigation.navigate('login');
  };

  const signIn = async () => {
    setSigningIn(true);

    if (!email || !password) {
      setSigningIn(false);
      return alert('please fill all the inputs');
    }
    if (email.length < 6 || password.length < 6) {
      setSigningIn(false);
      return alert('email and password must be 6 character long!');
    }
    try {
      const user = await auth().createUserWithEmailAndPassword(email, password);
      navigation.navigate('home');
      console.log('all okay');
    } catch (err) {
      setSigningIn(false);
      alert(err.message);
    }
  };

  const signInGoogle = async () => {
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    const userInfo = auth().signInWithCredential(googleCredential);
    userInfo
      .then(user => {
        console.log('user', user);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.mainContentWrapper}>
        <Input placeholder="Email" setValue={setEmail} textvalue={email} />
        <Input
          placeholder="Password"
          setValue={setPassword}
          textvalue={password}
          secure={true}
        />
        <ButtonComp
          text={signingIn == false ? 'SignIn' : 'SigningIn...'}
          btnClick={signIn}
        />
        <View style={{width: '100%', marginTop: 8}}>
          <ButtonComp text={'Login With Goggle'} btnClick={signInGoogle} />
        </View>
        <AccountTextComp
          text="Already have an account?"
          linkText="Login here!"
          click={gotoLoginPage}
        />
      </View>
    </SafeAreaView>
  );
};

export default Signin;
