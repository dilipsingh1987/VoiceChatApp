// App.tsx
import ChatScreen from './src/screens/ChatScreen';

import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSplashVisible(false), 2500); // 2.5s splash
    return () => clearTimeout(timer);
  }, []);

  if (isSplashVisible) {
    return (
      <View style={styles.splashContainer}>
        <Text style={styles.splashText}>🤖 VoiceChat AI</Text>
        <ActivityIndicator size="large" color="#007acc" />
      </View>
    );
  }

  return <ChatScreen />;
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eaf4ff',
  },
  splashText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007acc',
    marginBottom: 20,
  },
});
