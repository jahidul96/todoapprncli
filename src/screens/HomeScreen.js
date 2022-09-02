import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {COLORS} from '../Color/Coolor';
import {ButtonComp, Input} from '../components/Reuse';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const HomeScreen = () => {
  const [todo, setTodo] = useState('');
  const ref = firestore().collection('todos');
  const [alltodos, setAllTodos] = useState([]);

  const addTodo = async () => {
    await ref.add({
      title: todo,
      complete: false,
    });
    setTodo('');
  };

  const logout = async () => {
    await auth().signOut();
  };

  const update = async value => {
    await ref.doc(value.id).update({
      complete: !value.complete,
    });
  };
  const deleteTodo = async id => {
    await ref.doc(id).delete();
  };

  useEffect(() => {
    return ref.onSnapshot(querySnapshot => {
      const list = [];
      querySnapshot.forEach(doc => {
        const {title, complete} = doc.data();
        list.push({
          id: doc.id,
          title,
          complete,
        });
      });

      setAllTodos(list);
    });
  }, []);

  return (
    <View>
      <Text style={styles.title}>Todos</Text>
      <TouchableOpacity style={styles.logoutBtnWrapper} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      <View style={styles.inputWrapper}>
        <Input
          extraStyle={styles.extraStyle}
          setValue={setTodo}
          textvalue={todo}
        />
        <ButtonComp
          text="Add"
          btnExtraStyle={styles.btnExtraStyle}
          btnClick={addTodo}
        />
      </View>
      <ScrollView contentContainerStyle={styles.todoWrapper}>
        {alltodos.map(data => (
          <Todos
            value={data}
            key={data.id}
            updateTask={update}
            deleteTodo={deleteTodo}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const Todos = ({value, updateTask, deleteTodo}) => (
  <View style={[styles.singleTodos, styles.flexStyle]}>
    <View style={styles.flexStyle}>
      <TouchableOpacity
        onPress={() => updateTask(value)}
        style={[
          styles.delBtn,
          styles.editBtnWrapper,
          value.complete && {backgroundColor: 'red'},
        ]}></TouchableOpacity>
      <Text style={styles.todoText}>{value.title}</Text>
    </View>
    <TouchableOpacity
      style={styles.delBtn}
      onPress={() => deleteTodo(value.id)}>
      <Text style={styles.delText}>X</Text>
    </TouchableOpacity>
  </View>
);

export default HomeScreen;

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 25,
    color: COLORS.primary,
    fontWeight: 'bold',
    letterSpacing: 1,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
    height: 40,
  },
  inputWrapper: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  extraStyle: {
    width: '68%',
  },
  btnExtraStyle: {
    width: '25%',
    marginBottom: 10,
  },
  flexStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoWrapper: {
    marginHorizontal: 10,
  },
  singleTodos: {
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: COLORS.white,
    elevation: 2,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  todoText: {
    marginLeft: 10,
  },
  editBtnWrapper: {
    backgroundColor: COLORS.white,
    elevation: 5,
    width: 20,
    height: 20,
  },
  delBtn: {
    width: 30,
    backgroundColor: 'red',
    height: 30,
    borderRadius: 100 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  delText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  logoutBtnWrapper: {
    position: 'absolute',
    top: 20,
    right: 10,
    width: 40,
    height: 25,
    borderRadius: 5,
    backgroundColor: COLORS.lBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
