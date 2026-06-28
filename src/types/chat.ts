export type Language = 'english' | 'pidgin';

export type UserRole = 'general' | 'pregnant' | 'mother';

export type SymptomSeverity = 'emergency' | 'clinic' | 'home';

export interface PatientRecord {
  name: string;
  village: string;
  symptoms: string;
  maternalStatus: UserRole;
  bookingDetails?: {
    day: string;
    time: string;
    location: string;
  };
  contactPhone?: string;
}

export interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: number;
}

export type ConversationStep = 
  | 'GREETING'
  | 'LANGUAGE_DETECT'
  | 'NAME_VILLAGE'
  | 'SYMPTOMS'
  | 'TRIAGE_ASSESSMENT'
  | 'BOOKING_DAY'
  | 'BOOKING_TIME'
  | 'PHONE_CAPTURE'
  | 'MATERNAL_CHECK'
  | 'EDUCATION'
  | 'PASSPORT'
  | 'EMERGENCY';
