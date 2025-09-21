import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceAssistantProps {
  aiRecommendations: string;
  className?: string;
}

export const VoiceAssistant = ({ aiRecommendations, className = '' }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  // Initialize speech recognition
  const initSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice recognition error",
          description: "Please try again",
          variant: "destructive"
        });
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      return recognition;
    }
    return null;
  };

  // Handle voice commands
  const handleVoiceCommand = (command: string) => {
    if (command.includes('read') || command.includes('recommendations')) {
      readRecommendations();
    } else if (command.includes('stop') || command.includes('quiet')) {
      stopSpeaking();
    } else {
      toast({
        title: "Command not recognized",
        description: "Try saying 'read recommendations' or 'stop'"
      });
    }
  };

  // Text-to-speech function
  const readRecommendations = () => {
    if (!isEnabled || !aiRecommendations) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(aiRecommendations);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
      toast({
        title: "Speech error",
        description: "Unable to read recommendations",
        variant: "destructive"
      });
    };
    
    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Stop speaking
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Toggle voice listening
  const toggleListening = () => {
    if (!isEnabled) return;
    
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        recognitionRef.current = initSpeechRecognition();
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        toast({
          title: "Voice recognition not supported",
          description: "Your browser doesn't support voice recognition",
          variant: "destructive"
        });
      }
    }
  };

  // Toggle voice assistant on/off
  const toggleVoiceAssistant = () => {
    setIsEnabled(!isEnabled);
    if (isEnabled && isSpeaking) {
      stopSpeaking();
    }
    if (isEnabled && isListening) {
      recognitionRef.current?.stop();
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        {/* Voice Control Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={toggleListening}
            disabled={!isEnabled || isSpeaking}
            variant={isListening ? "default" : "outline"}
            size="icon"
            className={`h-12 w-12 rounded-full shadow-lg transition-all duration-200 ${
              isListening 
                ? 'bg-primary hover:bg-primary/90 animate-pulse' 
                : 'hover:scale-105'
            }`}
          >
            {isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Button>

          <Button
            onClick={isSpeaking ? stopSpeaking : readRecommendations}
            disabled={!isEnabled || !aiRecommendations}
            variant={isSpeaking ? "default" : "outline"}
            size="icon"
            className={`h-12 w-12 rounded-full shadow-lg transition-all duration-200 ${
              isSpeaking 
                ? 'bg-accent hover:bg-accent/90 animate-pulse' 
                : 'hover:scale-105'
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Voice Assistant Toggle */}
        <Button
          onClick={toggleVoiceAssistant}
          variant="ghost"
          size="sm"
          className={`text-xs px-2 py-1 ${
            isEnabled ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          Voice {isEnabled ? 'ON' : 'OFF'}
        </Button>

        {/* Status Indicator */}
        {(isListening || isSpeaking) && (
          <div className="text-xs text-center text-muted-foreground">
            {isListening && 'Listening...'}
            {isSpeaking && 'Speaking...'}
          </div>
        )}
      </div>
    </div>
  );
};