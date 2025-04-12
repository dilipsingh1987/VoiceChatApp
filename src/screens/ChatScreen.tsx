import React, {useState, useEffect, useRef} from 'react';

import {
  View,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatMessage from '../components/ChatMessage';
import VoiceInput from '../components/VoiceInput';
import {sendMessageToOpenAI} from '../services/openai';
import Tts from 'react-native-tts';

type Message = {
  id: string;
  msg: string;
  fromUser: boolean;
};

const STORAGE_KEY = '@chat_messages';
const generateUniqueId = () =>
  `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);

  useEffect(() => {
    Tts.setDefaultLanguage('en-US');
    //Tts.setDefaultRate(0.5);
    loadMessages();
  }, []);

  useEffect(() => {
    saveMessages();
    flatListRef.current?.scrollToEnd({animated: true});
  }, [messages]);

  const loadMessages = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMessages(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load messages', e);
    }
  };

  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save messages', e);
    }
  };
  const clearMessages = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setMessages([]);
    } catch (e) {
      console.error('Failed to clear messages', e);
    }
  };

  const addMessage = (msg: string, fromUser: boolean) => {
    const uniqueId = generateUniqueId();
    setMessages(prev => [...prev, {id: uniqueId, msg, fromUser}]);
  };

  const handleSend = async (message: string) => {
    if (!message.trim()) return;
  
    addMessage(message, true);  // Add user message to chat
    setText('');  // Clear the text input
  
    try {
      const aiReply = await sendMessageToOpenAI(message);
      setTimeout(() => {
        addMessage(aiReply, false); // Add AI response to chat
        if (ttsEnabled) Tts.speak(aiReply); // Speak the AI response if TTS is enabled
      }, 1000);
    } catch (error) {
      const errMsg = 'Error contacting AI.';
      addMessage(errMsg, false);  // Show error message in the chat
      if (ttsEnabled) Tts.speak(errMsg);  // Speak the error message if TTS is enabled
    }
  };
  

  const flatListRef = useRef<FlatList>(null);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({item}) => (
          <ChatMessage message={item.msg} fromUser={item.fromUser} />
        )}
        keyExtractor={item => item.id}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({animated: true})
        }
      />

      <VoiceInput onSpeech={txt => handleSend(txt)} />

      <TextInput
        placeholder="Type a message..."
        value={text}
        onChangeText={setText}
        style={styles.input}
      />
      <Button title="Send" onPress={() => handleSend(text)} />

      <TouchableOpacity
        onPress={() => setTtsEnabled(!ttsEnabled)}
        style={styles.ttsButton}>
        <Text style={styles.ttsText}>
          {ttsEnabled
            ? '🔊 TTS On (Tap to mute)'
            : '🔇 TTS Off (Tap to unmute)'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={clearMessages} style={styles.clearButton}>
        <Text style={styles.clearText}>🗑️ Clear Chat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop:50,
    marginBottom:50
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 8,
  },
  ttsButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
  },
  ttsText: {
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    alignItems: 'center',
  },
  clearText: {
    color: '#721c24',
    fontWeight: 'bold',
  },
});
