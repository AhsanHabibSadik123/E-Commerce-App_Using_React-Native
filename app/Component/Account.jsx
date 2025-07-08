import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../../auth/firebase';

const Account = ({ onLogout }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          try {
            await signOut(auth);
            onLogout && onLogout();
          } catch (error) {
            console.error('Logout Error:', error.message);
          }
        }}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff3f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#E96E6E',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
