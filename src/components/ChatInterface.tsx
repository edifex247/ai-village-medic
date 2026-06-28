import React, { useState, useRef, useEffect } from 'react';
import { useConversation } from '../hooks/useConversation';
import { HealthPassport } from './HealthPassport';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, Send, Bot, User, Volume2, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatInterface: React.FC = () => {
  const { messages, step, record, isProcessing, processInput, language } = useConversation();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isProcessing) {
      processInput(input);
      setInput('');
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Voice input is not supported in this browser. Please type your message.");
      return;
    }

    // @ts-ignore
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === 'english' ? 'en-US' : 'en-NG'; // Nigeria English as proxy for Pidgin

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const jsonLog = {
    record_type: "RURAL_HEALTH_LOG",
    patient_name: record.name,
    maternal_status: record.maternalStatus,
    reported_symptoms: record.symptoms,
    educational_topic_shared: record.maternalStatus === 'mother' ? "Maternal Care" : "Malaria Prevention",
    booking_details: record.bookingDetails ? `${record.bookingDetails.day}, ${record.bookingDetails.time} at ${record.bookingDetails.location}` : "None",
    contact_phone: record.contactPhone || "None"
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-2xl mx-auto bg-white rounded-xl shadow-xl border border-cyan-100 overflow-hidden">
      {/* Header */}
      <div className="bg-cyan-600 p-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none">EdifexMed Assistant</h1>
            <p className="text-xs text-cyan-100 mt-1 flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              {language === 'english' ? 'Ready to help you' : 'I dey here to help you'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/10"
            onClick={() => setShowJson(!showJson)}
          >
            <FileText size={20} />
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4 bg-slate-50" ref={scrollRef}>
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex items-end gap-2 max-w-[85%]",
                  m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-1 shadow-sm",
                  m.role === 'user' ? "bg-emerald-500 text-white" : "bg-cyan-600 text-white"
                )}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                  m.role === 'user' 
                    ? "bg-emerald-600 text-white rounded-br-none" 
                    : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                )}>
                  {m.content.includes('⚠️ EMERGENCY') ? (
                    <div className="bg-red-50 text-red-900 p-3 rounded-lg border border-red-200 flex gap-3 items-start font-bold">
                      <AlertCircle className="text-red-600 shrink-0" size={20} />
                      <span>{m.content}</span>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isProcessing && (
            <div className="flex items-center gap-2 text-slate-400 italic text-xs ml-10">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
              {language === 'english' ? 'Assistant is typing...' : 'Assistant dey write...'}
            </div>
          )}

          {step === 'PASSPORT' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="py-4"
            >
              <HealthPassport record={record} />
            </motion.div>
          )}

          {showJson && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-lg overflow-x-auto shadow-xl"
            >
              <div className="flex justify-between items-center mb-2 border-b border-emerald-900 pb-2">
                <span className="text-slate-500 uppercase tracking-widest text-[10px]">Developer Log</span>
                <button onClick={() => setShowJson(false)} className="text-slate-400 hover:text-white">×</button>
              </div>
              <pre>{JSON.stringify(jsonLog, null, 2)}</pre>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn(
              "rounded-full shrink-0 h-12 w-12 transition-all duration-300",
              isListening ? "bg-red-100 text-red-600 border-red-200 animate-pulse" : "text-cyan-600 border-cyan-100 hover:bg-cyan-50"
            )}
            onClick={handleVoiceInput}
            disabled={isProcessing}
          >
            {isListening ? <Volume2 size={24} /> : <Mic size={24} />}
          </Button>
          
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'english' ? "Type your message here..." : "Write your message for here..."}
              className="rounded-full h-12 pr-12 bg-slate-50 border-slate-200 focus:ring-cyan-500 focus:border-cyan-500"
              disabled={isProcessing}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1 top-1 h-10 w-10 rounded-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-md transition-transform active:scale-95"
              disabled={!input.trim() || isProcessing}
            >
              <Send size={18} />
            </Button>
          </div>
        </form>
        
        <div className="flex justify-between items-center mt-3 px-2">
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
            {language === 'english' ? 'English' : 'Nigerian Pidgin'} Mode
          </p>
          <div className="flex gap-4">
             {step === 'BOOKING_DAY' && (
               <div className="flex gap-1">
                 {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                   <button 
                     key={day}
                     onClick={() => { setInput(day); setTimeout(() => handleSubmit(), 100); }}
                     className="text-[10px] px-2 py-1 bg-cyan-50 text-cyan-700 rounded border border-cyan-100 hover:bg-cyan-100"
                   >
                     {day}
                   </button>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
