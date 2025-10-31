
import React, { useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import * as geminiService from '../services/geminiService';
import { Copy, Printer, Save, FileText, XCircle, Mic, MicOff, Wand2, Smile, Angry, Meh } from 'lucide-react';
import { Sentiment } from '../types';

export const VoiceTyping: React.FC = () => {
  const { text, setText, isListening, startListening, stopListening, resetText, error, hasSupport } = useSpeechRecognition();
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiResult, setAiResult] = useState<{ type: 'sentiment' | 'correction' | 'error'; data: any } | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };
  
  const handlePrint = () => {
    const printable = document.createElement('div');
    printable.id = 'printable-content';
    printable.innerHTML = `<pre>${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`;
    document.body.appendChild(printable);
    window.print();
    document.body.removeChild(printable);
  };
  
  const downloadAsFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveAsDoc = () => {
    downloadAsFile('nepali-voice-text.doc', text, 'application/msword');
  };
  
  const handleSaveAsTxt = () => {
    downloadAsFile('nepali-voice-text.txt', text, 'text/plain');
  };

  const handleCorrectText = async () => {
    if (!text.trim()) return;
    setIsLoadingAI(true);
    setAiResult(null);
    try {
      const correctedText = await geminiService.correctText(text);
      setText(correctedText);
      setAiResult({ type: 'correction', data: 'Text corrected successfully!' });
    } catch (e: any) {
      setAiResult({ type: 'error', data: e.message });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleDetectSentiment = async () => {
    if (!text.trim()) return;
    setIsLoadingAI(true);
    setAiResult(null);
    try {
      const sentiment = await geminiService.detectSentiment(text);
      setAiResult({ type: 'sentiment', data: sentiment });
    } catch (e: any) {
      setAiResult({ type: 'error', data: e.message });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const SentimentIcon = ({ sentiment }: { sentiment: Sentiment }) => {
    switch (sentiment) {
      case Sentiment.HAPPY: return <Smile className="text-green-500" />;
      case Sentiment.ANGRY: return <Angry className="text-red-500" />;
      case Sentiment.NEUTRAL: return <Meh className="text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col items-center">
      <div className="w-full max-w-4xl p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex flex-col flex-grow">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="बोलना सुरु गर्नुहोस् or start typing..."
          className="w-full flex-grow bg-slate-200 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-6 rounded-xl text-lg resize-none focus:outline-none focus:ring-2 focus:ring-rose-400"
        />

        <div className="flex flex-wrap gap-3 mt-4 items-center justify-center">
          <ActionButton onClick={handleCopy} icon={<Copy size={16} />} label="Copy" />
          <ActionButton onClick={handlePrint} icon={<Printer size={16} />} label="Print" />
          <ActionButton onClick={handleSaveAsDoc} icon={<Save size={16} />} label="Save as Doc" />
          <ActionButton onClick={handleSaveAsTxt} icon={<FileText size={16} />} label="Save as Txt" />
          <ActionButton onClick={resetText} icon={<XCircle size={16} />} label="Reset" className="bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900" />
        </div>

        <div className="mt-6 flex flex-col items-center">
            {hasSupport ? (
                <button
                    onClick={isListening ? stopListening : startListening}
                    className="flex items-center justify-center w-48 h-16 rounded-full text-white font-bold text-lg shadow-lg transform transition-transform hover:scale-105 bg-gradient-to-r from-red-500 to-pink-500"
                >
                    {isListening ? (
                        <>
                            <MicOff className="mr-2 animate-pulse" />
                            Stop
                        </>
                    ) : (
                        <>
                            <Mic className="mr-2" />
                            Start Now
                        </>
                    )}
                </button>
            ) : (
                 <p className="text-red-500">Speech recognition not supported.</p>
            )}
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4 flex flex-col sm:flex-row gap-4 items-center justify-center">
           <h3 className="text-sm font-semibold text-slate-500 mb-2 sm:mb-0">AI Tools:</h3>
            <div className="flex gap-2">
                <AiButton onClick={handleCorrectText} icon={<Wand2 size={16} />} label="Correct Text" loading={isLoadingAI} />
                <AiButton onClick={handleDetectSentiment} icon={<Smile size={16} />} label="Detect Sentiment" loading={isLoadingAI} />
            </div>
        </div>

        {aiResult && (
          <div className="mt-4 p-3 rounded-lg text-center text-sm bg-slate-100 dark:bg-slate-700">
            {aiResult.type === 'error' && <p className="text-red-500">{aiResult.data}</p>}
            {aiResult.type === 'correction' && <p className="text-green-500">{aiResult.data}</p>}
            {aiResult.type === 'sentiment' && (
              <div className="flex items-center justify-center gap-2">
                <SentimentIcon sentiment={aiResult.data} />
                <span className="font-semibold">Detected Sentiment: {aiResult.data}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-auto pt-6 text-center text-xs text-slate-400">
            <div className="p-3 bg-yellow-100/50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg">
                This is a promotional banner space for ads or information.
            </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string; className?: string }> = ({ onClick, icon, label, className }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 ${className}`}
  >
    {icon}
    {label}
  </button>
);

const AiButton: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string; loading: boolean }> = ({ onClick, icon, label, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full transition-colors bg-rose-100 text-rose-600 hover:bg-rose-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-900"
  >
    {loading ? (
      <div className="w-4 h-4 border-2 border-rose-400 border-t-transparent rounded-full animate-spin"></div>
    ) : (
      icon
    )}
    {label}
  </button>
);

