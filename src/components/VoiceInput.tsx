import React, { useEffect, useState } from 'react';
import { Button, View } from 'react-native';
import Voice from '@react-native-voice/voice';

export default function VoiceInput({ onSpeech }: { onSpeech: (text: string) => void }) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // To ensure only one speech result is processed

  useEffect(() => {
    Voice.onSpeechResults = (e) => {
      const text = e.value?.[0];

      if (text && !isProcessing) {
        setIsProcessing(true);  // Block further processing of multiple results
        onSpeech(text);         // Pass the result to the parent component
        setIsListening(false);  // Stop listening after speech is processed
        setIsProcessing(false); // Reset processing state after handling the result
      }
    };

    Voice.onSpeechEnd = () => setIsListening(false); // Stop listening when speech ends

    return () => {
      Voice.destroy().then(Voice.removeAllListeners); // Cleanup listeners on component unmount
    };
  }, [isProcessing, onSpeech]);

  const startListening = async () => {
    try {
      setIsListening(true); // Indicate that we're listening
      await Voice.start('en-US'); // Start listening to speech
    } catch (err) {
      console.error('Voice start error:', err);
      setIsListening(false); // Reset listening state in case of an error
    }
  };

  return (
    <View>
      <Button 
        title={isListening ? 'Listening...' : '🎙️ Speak'} 
        onPress={startListening} 
        disabled={isListening} 
      />
    </View>
  );
}
