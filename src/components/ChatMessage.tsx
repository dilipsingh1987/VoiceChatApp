// components/ChatMessage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ChatMessage({ message, fromUser }: { message: string; fromUser: boolean }) {
  return (
    <View style={[styles.bubble, fromUser ? styles.user : styles.ai]}>
      <Text>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '75%',
  },
  user: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6' },
  ai: { alignSelf: 'flex-start', backgroundColor: '#ECECEC' },
});
