import { useState, useCallback, useEffect } from 'react';
import { Message, ConversationStep, Language, PatientRecord, UserRole } from '../types/chat';

const PIDGIN_KEYWORDS = ['dey', 'baba', 'pikin', 'belly', 'run', 'pepper', 'body', 'don', 'wetin', 'abi', 'joor', 'abeg', 'sabi'];
const EMERGENCY_KEYWORDS = ['chest pain', 'bleeding', 'cannot breathe', 'heavy bleeding', 'dehydration', 'faint', 'sharp pain', 'die'];

const CONTENT = {
  english: {
    greeting: "Hello, I am EdifexMed. I am here to help you and your family stay healthy. How can I assist you today?",
    askNameVillage: "To help you better, may I know your name and which village you are calling from?",
    askSymptoms: "Thank you, {name}. Please tell me, wetin... I mean, what is bothering you today? How does your body feel?",
    triageClinic: "I understand. Based on what you told me, it would be best for you to see a doctor at the clinic. Would you like to book an appointment?",
    triageHome: "It sounds like you can manage this at home with rest and plenty of water. I will give you some tips soon.",
    askBookingDay: "Which day would you like to come? (Monday-Friday)",
    askBookingTime: "Would you prefer Morning or Afternoon?",
    askPhone: "Please provide your mobile number so the clinic can reach you.",
    maternalCheck: "Are you currently pregnant or do you have a young child (infant) at home?",
    educationMalaria: "Malaria is like a small army attacking your blood. Sleeping under a net keeps the mosquitoes (the carriers) away.",
    educationPregnancy: "Regular checkups are like preparing the soil for a new seed. It ensures both mother and baby grow strong.",
    passportReady: "Your Health Passport is ready. You can show this to the nurse or doctor at the clinic.",
    emergency: "⚠️ EMERGENCY NOTICE: Please do not wait at all. This issue is serious. Go immediately to the nearest General Hospital or see your community health worker right now!"
  },
  pidgin: {
    greeting: "Adoo! I be EdifexMed. I dey here to help you and your family well-well. Wetin dey shele today?",
    askNameVillage: "Abeg, tell me your name and which village you dey stay so I go fit help you better.",
    askSymptoms: "Thank you, {name}. Abeg tell me, wetin dey do you? How your body dey feel?",
    triageClinic: "I hear you. Di way you talk, e good make you see doctor for clinic. You wan make I book space for you?",
    triageHome: "No shaking. Dis one, you fit treat am for house. Just rest and drink plenty water. I go give you some advice small time.",
    askBookingDay: "Which day you wan come? (Monday-Friday)",
    askBookingTime: "You go like come for Morning or Afternoon?",
    askPhone: "Abeg give me your phone number so di clinic people go fit call you.",
    maternalCheck: "You carry belle now? Or you get small pikin (infant) for house?",
    educationMalaria: "Malaria be like small army wey dey attack your blood. If you sleep inside net, dose mosquitoes no go reach you at all.",
    educationPregnancy: "Antenatal checkup be like when person dey prepare ground to plant beta seed. E dey make mama and pikin strong well-well.",
    passportReady: "Your Health Passport don set. You fit show dis one to di nurse or doctor for clinic.",
    emergency: "⚠️ EMERGENCY NOTICE: Abeg no wait at all. Dis tin serious. Go immediately to di nearest General Hospital or see your community health worker right now!"
  }
};

export const useConversation = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('edifex_messages');
    return saved ? JSON.parse(saved) : [];
  });
  const [step, setStep] = useState<ConversationStep>(() => {
    return (localStorage.getItem('edifex_step') as ConversationStep) || 'GREETING';
  });
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('edifex_lang') as Language) || 'english';
  });
  const [record, setRecord] = useState<PatientRecord>(() => {
    const saved = localStorage.getItem('edifex_record');
    return saved ? JSON.parse(saved) : {
      name: '',
      village: '',
      symptoms: '',
      maternalStatus: 'general',
    };
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    localStorage.setItem('edifex_messages', JSON.stringify(messages));
    localStorage.setItem('edifex_step', step);
    localStorage.setItem('edifex_lang', language);
    localStorage.setItem('edifex_record', JSON.stringify(record));
  }, [messages, step, language, record]);

  const addMessage = (role: 'assistant' | 'user', content: string) => {
    setMessages(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      role,
      content,
      timestamp: Date.now(),
    }]);
  };

  const detectLanguage = (input: string): Language => {
    const words = input.toLowerCase().split(' ');
    const hasPidgin = words.some(word => PIDGIN_KEYWORDS.includes(word));
    return hasPidgin ? 'pidgin' : 'english';
  };

  const checkEmergency = (input: string): boolean => {
    const lowerInput = input.toLowerCase();
    return EMERGENCY_KEYWORDS.some(keyword => lowerInput.includes(keyword));
  };

  const processInput = async (input: string) => {
    if (!input.trim()) return;

    addMessage('user', input);
    setIsProcessing(true);

    // Simulate network delay for "empathy" and realism
    await new Promise(resolve => setTimeout(resolve, 800));

    if (checkEmergency(input)) {
      setStep('EMERGENCY');
      addMessage('assistant', CONTENT[language].emergency);
      setIsProcessing(false);
      return;
    }

    const currentLang = step === 'GREETING' ? detectLanguage(input) : language;
    if (step === 'GREETING') setLanguage(currentLang);

    const nextStep = (currentStep: ConversationStep, userInput: string): ConversationStep => {
      switch (currentStep) {
        case 'GREETING':
          return 'NAME_VILLAGE';
        case 'NAME_VILLAGE':
          // Simple heuristic to split name and village
          const parts = userInput.split(/ (?:in|from|at) /i);
          setRecord(prev => ({ ...prev, name: parts[0] || 'Patient', village: parts[1] || 'Unknown' }));
          return 'SYMPTOMS';
        case 'SYMPTOMS':
          setRecord(prev => ({ ...prev, symptoms: userInput }));
          // Simple triage logic
          return userInput.length > 30 || userInput.includes('pain') || userInput.includes('fever') ? 'BOOKING_DAY' : 'MATERNAL_CHECK';
        case 'BOOKING_DAY':
          setRecord(prev => ({ ...prev, bookingDetails: { ...prev.bookingDetails!, day: userInput, location: 'General Clinic', time: '' } }));
          return 'BOOKING_TIME';
        case 'BOOKING_TIME':
          setRecord(prev => ({ ...prev, bookingDetails: { ...prev.bookingDetails!, time: userInput } }));
          return 'PHONE_CAPTURE';
        case 'PHONE_CAPTURE':
          setRecord(prev => ({ ...prev, contactPhone: userInput }));
          return 'MATERNAL_CHECK';
        case 'MATERNAL_CHECK':
          const isMaternal = userInput.toLowerCase().includes('yes') || userInput.toLowerCase().includes('belle') || userInput.toLowerCase().includes('pikin');
          setRecord(prev => ({ ...prev, maternalStatus: isMaternal ? 'mother' : 'general' }));
          return 'EDUCATION';
        case 'EDUCATION':
          return 'PASSPORT';
        default:
          return 'PASSPORT';
      }
    };

    const next = nextStep(step, input);
    setStep(next);

    let response = '';
    switch (next) {
      case 'NAME_VILLAGE':
        response = CONTENT[currentLang].askNameVillage;
        break;
      case 'SYMPTOMS':
        response = CONTENT[currentLang].askSymptoms.replace('{name}', record.name || 'my friend');
        break;
      case 'BOOKING_DAY':
        response = CONTENT[currentLang].triageClinic + " " + CONTENT[currentLang].askBookingDay;
        break;
      case 'BOOKING_TIME':
        response = CONTENT[currentLang].askBookingTime;
        break;
      case 'PHONE_CAPTURE':
        response = CONTENT[currentLang].askPhone;
        break;
      case 'MATERNAL_CHECK':
        response = (step === 'SYMPTOMS' ? CONTENT[currentLang].triageHome + " " : "") + CONTENT[currentLang].maternalCheck;
        break;
      case 'EDUCATION':
        response = record.maternalStatus === 'mother' ? CONTENT[currentLang].educationPregnancy : CONTENT[currentLang].educationMalaria;
        response += " " + CONTENT[currentLang].passportReady;
        break;
      case 'PASSPORT':
        response = CONTENT[currentLang].passportReady;
        break;
    }

    if (response) addMessage('assistant', response);
    setIsProcessing(false);
  };

  useEffect(() => {
    if (messages.length === 0) {
      addMessage('assistant', CONTENT.english.greeting);
    }
  }, [messages.length]);

  return {
    messages,
    step,
    language,
    record,
    isProcessing,
    processInput,
  };
};
