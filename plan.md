# Implementation Plan - EdifexMed Rural Health Companion

Build a highly empathetic, culturally aware, and specialized AI health assistant designed for remote villages in Nigeria. The app will feature a conversational interface that supports both English and Nigerian Pidgin, manages basic health records, provides education, and handles emergency triaging.

## Scope & Non-Goals
- **Scope**: Multi-modal conversational interface (text/audio simulation), Language switching (English/Pidgin), Triage workflow, Appointment booking (UI only), Health Passport generation, Emergency alerts, JSON data logging.
- **Non-Goals**: Real-time server-side voice processing (will simulate/use Web Speech API if possible, or focused text interface), Real database persistence (localStorage only), Real medical diagnosis.

## Assumptions & Open Questions
- **Assumption**: Audio input will be handled via the browser's `SpeechRecognition` API (Web Speech API) for transcription.
- **Assumption**: "Local language" primarily means Nigerian Pidgin in this context.
- **Open Question**: Should the "JSON log" be visible to the user or just console/stored? (Plan: Visible as a 'Developer/Record' view for the session).

## Affected Areas
- **Frontend**: New UI for the chat interface, Health Passport display, Emergency alert overlays.
- **Data**: Client-side state management for the conversation and patient record.

## Phases

### 1. Project Setup & Core Components
- Setup basic layout with a focus on "Low-Bandwidth" feel (clean, fast-loading).
- Install any necessary icons (Lucide React).
- Create a reusable `ChatMessage` and `ChatInput` component.
- **Owner**: frontend_engineer

### 2. Conversational Engine & State Management
- Implement a state machine to handle the 4 pillars (Triage, Records, Education, Maternal/Child).
- Implement language detection/switching logic (English <-> Pidgin).
- Add safety trigger detection (Red Alert keywords).
- **Owner**: frontend_engineer

### 3. Pillars Implementation (Logic & UI)
- **Triage**: Flow to collect name, village, symptoms, and determine urgency.
- **Booking**: UI for selecting day/time and phone number capture.
- **Health Passport**: Generate a "Screenshot-friendly" summary view.
- **Education/Maternal**: Content library for localized advice.
- **Owner**: frontend_engineer

### 4. Audio & Polish
- Integrate `SpeechRecognition` API for voice input simulation.
- Final styling for empathy and cultural relevance (warm colors, respectful tone).
- Implement the final JSON log output.
- **Owner**: frontend_engineer

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Build the entire application from UI to conversational logic as per the 4 pillars.

**Per-agent instructions:**
### 1. frontend_engineer
- **Phases:** 1, 2, 3, 4
- **Scope:** Create a single-page React application for EdifexMed. 
- **Files:** 
    - `src/App.tsx`: Main entry and layout.
    - `src/components/ChatInterface.tsx`: The heart of the app.
    - `src/components/HealthPassport.tsx`: The summary view.
    - `src/hooks/useConversation.ts`: Logic for the state machine and language switching.
- **Depends on:** none
- **Acceptance criteria:** 
    - App starts with an empathetic greeting.
    - App switches to Pidgin if the user uses Pidgin.
    - Emergency triggers (e.g., "severe bleeding") immediately show a Red Alert.
    - User can "book" an appointment and see a summary "Health Passport".
    - A JSON log is produced at the end of the session.
    - Voice input (Speech-to-Text) works or is clearly simulated.
