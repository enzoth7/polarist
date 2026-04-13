import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type Message = {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

const ChatAssistant = () => {
  const { status } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [welcomeSent, setWelcomeSent] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !welcomeSent) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        const welcomeMsg: Message = {
          id: "welcome",
          text: "¡Buenas! Soy tu asistente de Polarist. Decime, ¿en qué te puedo dar una mano hoy?",
          sender: "assistant",
          timestamp: new Date(),
        };
        setMessages([welcomeMsg]);
        setWelcomeSent(true);
        setIsTyping(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, welcomeSent]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  // El asistente solo se renderiza si el usuario está autenticado
  if (status !== "authenticated") return null;

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Tiempo de respuesta realista (15 - 20 segundos según longitud)
    const baseDelay = 15000;
    const dynamicDelay = Math.min(5000, inputValue.length * 50);
    const finalDelay = baseDelay + dynamicDelay;

    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputValue),
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, finalDelay);
  };

  const getAIResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("quiénes") || q.includes("quienes") || q.includes("polarist")) {
      return "Mirá, Polarist es básicamente para que no te vuelvas loco con la tecnología. La idea es que cualquier negocio pueda usar IA sin tener que ser un genio de las computadoras. Así de simple.";
    }
    if (q.includes("herramientas") || q.includes("tools")) {
      return "Mirá, tenemos una lista con lo mejorcito que hay dando vueltas. Lo organizamos para que sepas exacto cuál te sirve para el laburo diario, sin vueltas.";
    }
    if (q.includes("recursos") || q.includes("guías")) {
      return "En la parte de Recursos tenés banda de atajos. Son guías cortitas y al pie para que empieces a usar la IA ya mismo, sin perder tiempo.";
    }
    return "Está bueno lo que me preguntás. Mirá, como tu asistente, estoy todo el tiempo fichando qué hay de nuevo en la página para darte una respuesta clara. ¿Querés que hablemos más de las herramientas o de cómo empezar?";
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] sm:bottom-8 sm:right-8">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-4 flex h-[550px] w-[350px] flex-col overflow-hidden rounded-2xl border border-white bg-[#F0F2F6] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)] sm:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-white px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-zinc-100 shadow-sm">
                  <img src="/Polarist_logo.jpeg" alt="Logo de Polarist" className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight text-zinc-900">Tu asistente personal</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white bg-black px-1.5 py-0.5 rounded-[1px]">Polarist</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="group flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 transition-all hover:bg-zinc-200 hover:text-zinc-900"
              >
                <X size={15} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              <div className="flex flex-col gap-5">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-[2rem] px-5 py-4 text-sm font-normal leading-relaxed shadow-sm ${
                        msg.sender === "user"
                          ? "bg-zinc-900 text-white rounded-br-none"
                          : "bg-white text-zinc-900 border border-white rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white text-zinc-900 rounded-[2rem] rounded-tl-none px-5 py-4 shadow-sm border border-white flex items-center gap-1.5">
                      <motion.div 
                        animate={{ y: [0, -3, 0] }} 
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                        className="h-1 w-1 rounded-full bg-zinc-300" 
                      />
                      <motion.div 
                        animate={{ y: [0, -3, 0] }} 
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                        className="h-1 w-1 rounded-full bg-zinc-300" 
                      />
                      <motion.div 
                        animate={{ y: [0, -3, 0] }} 
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                        className="h-1 w-1 rounded-full bg-zinc-300" 
                      />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-white px-6 pb-6 pt-3">
              <div className="relative flex items-center group">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Escribí tu pregunta acá..."
                  className="w-full rounded-[2rem] border border-zinc-100 bg-zinc-50 py-2.5 pl-6 pr-12 text-sm font-normal text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-200 focus:bg-white focus:outline-none transition-all shadow-sm"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white transition-all hover:scale-105 active:scale-95"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(true)}
            className="group relative flex h-20 w-20 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
          >
            {/* Aura/Brillo exterior suave */}
            <div className="absolute inset-0 rounded-full bg-[#ccff00]/15 blur-2xl animate-pulse" />
            
            {/* Esfera de Luz Polarist */}
            <div className="relative h-16 w-16 rounded-full shadow-[0_0_30px_rgba(204,255,0,0.4)]">
              {/* Cuerpo de la esfera con degradado de luz densa */}
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,_#ffffff_0%,_#f2ffcc_15%,_#ccff00_50%,_#aacc00_100%)]" />
              
              {/* Brillo ambiental interno */}
              <div className="absolute inset-0 rounded-full border border-white/20" />
              
              {/* Reflejo especular superior principal */}
              <motion.div 
                animate={{ 
                  opacity: [0.6, 0.9, 0.6],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-[20%] top-[15%] h-7 w-7 rounded-full bg-white/50 blur-md" 
              />

              {/* Reflejo secundario inferior para volumen */}
              <div className="absolute bottom-[10%] right-[20%] h-4 w-4 rounded-full bg-white/20 blur-sm" />
            </div>

            {/* Partículas orbitales - El regreso */}
            <div className="absolute inset-0 animate-[spin_8s_linear_infinite]">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute h-1.5 w-1.5 rounded-full bg-[#ccff00] shadow-[0_0_8px_#ccff00]"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 120}deg) translate(42px)`
                  }}
                />
              ))}
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatAssistant;
