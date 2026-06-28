import { ChatInterface } from "./components/ChatInterface";
import { Heart, ShieldCheck, Clock, MapPin, Sparkles } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-[#ECFEFF] text-[#164E63] font-sans selection:bg-cyan-200">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-cyan-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-cyan-600 p-1.5 rounded-lg shadow-inner">
              <Heart className="text-white fill-white" size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-cyan-900">EdifexMed</span>
          </div>
          <div className="flex gap-6 text-sm font-medium">
             <span className="text-cyan-600 flex items-center gap-1.5">
               <ShieldCheck size={16} /> Secure
             </span>
             <span className="hidden sm:flex text-cyan-600 items-center gap-1.5">
               <Sparkles size={16} /> Trusted
             </span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content: Hero & Info */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 bg-cyan-100 text-cyan-700 text-xs font-bold uppercase tracking-widest rounded-full">
                Remote Health Companion
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                Bridging the Health Gap in <span className="text-cyan-600 italic">Every Village.</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                Talk or type to your health companion. We understand your local language, help you avoid long clinic trips, and keep your records safe.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Clock, title: "No Long Travel", desc: "Triage from home before you travel." },
                { icon: ShieldCheck, title: "Health Passport", desc: "Carry your medical history in your pocket." },
                { icon: MapPin, title: "Local Access", desc: "Find help right in your community." },
                { icon: Heart, title: "Maternal Care", desc: "Special support for moms and babies." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-white border border-cyan-100 shadow-sm flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors duration-300">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl group border-4 border-white">
              <img 
                src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/e5de8b98-9301-4266-9269-fcdbef6779c4/edifexmed-rural-health-companion-hero-15c0917f-1782683580340.webp" 
                alt="Rural healthcare assistant" 
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/60 to-transparent flex items-end p-6">
                <p className="text-white font-medium text-sm italic">"Empowering villages through local care and understanding."</p>
              </div>
            </div>
          </div>

          {/* Right Content: Chat Interface */}
          <div className="animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
            <ChatInterface />
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-cyan-100 bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-70">
            <Heart className="text-cyan-600" size={18} />
            <span className="font-bold text-slate-800">EdifexMed Rural Companion</span>
          </div>
          <p className="text-xs text-slate-400 font-medium tracking-wide">
            © 2024 EDIFEXMED. DESIGNED FOR EMPATHY. SERVING THE LAST MILE.
          </p>
          <div className="flex gap-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span>Privacy Policy</span>
            <span>Local Language Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
