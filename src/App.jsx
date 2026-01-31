import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, MessageCircle, FileText, ChevronRight, Github, Globe, Shield, Download, Lock, Zap, BarChart3, Fingerprint, Mail, WifiOff, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import JSZip from 'jszip';
import { toPng } from 'html-to-image';
import { GlassCard } from './components/ui/GlassCard';
import Dashboard from './components/Dashboard';
import GuideSection from './components/GuideSection';
import PrivacyModal from './components/PrivacyModal';
import { parseWhatsAppChat } from './utils/parser';

function App() {
  const { t, i18n } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [showPrivacy, setShowPrivacy] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'tr' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setFileName(file.name);

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      let text = '';
      if (file.type === "application/zip" || file.name.endsWith(".zip")) {
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        const txtFiles = Object.keys(contents.files).filter(name => name.endsWith('.txt') && !name.startsWith('__MACOSX'));

        if (txtFiles.length === 0) {
          alert("No .txt file found in the zip!");
          setLoading(false);
          return;
        }
        text = await contents.files[txtFiles[0]].async("string");
      } else {
        text = await file.text();
      }

      const data = parseWhatsAppChat(text);
      setStats(data);
    } catch (error) {
      console.error("Parsing error", error);
      alert(t('parsing_error_alert') || "Error processing file");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStats(null);
    setFileName('');
  };

  const guideRef = useRef(null);

  const scrollToGuide = () => {
    guideRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const dashboardRef = useRef(null);

  const downloadImage = async () => {
    if (dashboardRef.current === null) return;
    try {
      const dataUrl = await toPng(dashboardRef.current, { cacheBust: true, backgroundColor: '#09090b' });
      const link = document.createElement('a');
      link.download = 'chatwrapp-stats.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30 selection:text-white relative overflow-hidden">
      <AnimatePresence>
        {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      </AnimatePresence>

      {/* Floating Blobs Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px] animate-blob mix-blend-screen" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] animate-blob animation-delay-2000 mix-blend-screen" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] animate-blob animation-delay-4000 mix-blend-screen" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">

        {/* Navbar */}
        <nav className="flex justify-between items-center mb-16 animate-fade-in">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={reset}>
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative p-2.5 bg-white/5 border border-white/10 rounded-xl">
                <MessageCircle className="text-emerald-400" size={24} />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white group-hover:tracking-tighter transition-all duration-300">
              Chat<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Wrapp</span>
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {stats && (
              <div className="flex items-center gap-2">
                <button onClick={downloadImage} className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-full transition-all text-sm font-medium">
                  <Download size={16} />
                  <span>{t('export_image')}</span>
                </button>
                <button onClick={reset} className="text-sm text-slate-400 hover:text-white transition-colors px-2">
                  {t('analyze_another')}
                </button>
              </div>
            )}

            {/* How to Export Button */}
            {!stats && (
              <button onClick={scrollToGuide} className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all hidden md:flex">
                <span>{t('how_to_export')}</span>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-1 text-emerald-400" />
              </button>
            )}

            <div className="h-6 w-px bg-white/10 hidden md:block" />

            {/* Contact */}
            <a href="mailto:info@chatwrapp.com" className="p-2.5 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 transition-colors text-slate-300 hover:text-white group relative" aria-label={t('tooltip_contact')}>
              <Mail size={18} />
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none z-50">
                {t('tooltip_contact')}
              </div>
            </a>

            {/* Language Toggle */}
            <button onClick={toggleLanguage} className="flex items-center gap-2 p-2.5 sm:pl-3 sm:pr-4 sm:py-2 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 transition-colors text-slate-300 group relative" aria-label={t('tooltip_language')}>
              <Globe size={18} />
              <span className="hidden sm:block text-xs font-bold tracking-wider">{i18n.language.toUpperCase()}</span>
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none z-50">
                {t('tooltip_language')}
              </div>
            </button>

            {/* Privacy Toggle */}
            <button onClick={() => setShowPrivacy(true)} className="p-2.5 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 transition-colors text-slate-300 group relative" aria-label={t('tooltip_privacy')}>
              <Shield size={18} />
              <div className="absolute top-full mt-2 right-0 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none z-50">
                {t('tooltip_privacy')}
              </div>
            </button>

            {/* GitHub Link */}
            <a href="https://github.com/furkanemiruzun/wpwrapped" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 transition-colors text-slate-300 group relative" aria-label="GitHub">
              <Github size={18} />
              <div className="absolute top-full mt-2 right-0 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 pointer-events-none z-50">
                {t('tooltip_github')}
              </div>
            </a>
          </div>
        </nav>

        <AnimatePresence mode="wait">
          {!stats ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl mx-auto"
            >
              {/* Hero Section */}
              <div className="text-center mb-16 relative">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm font-medium mb-8 backdrop-blur-sm"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {t('hero_badge')}
                </motion.div>

                <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                  {t('hero_title_start')} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 animate-pulse">{t('hero_title_end')}</span>
                </h2>

                <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
                  {t('hero_subtitle')}
                </p>

                {/* Premium Upload Zone */}
                <div className="relative max-w-xl mx-auto group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                  <label className="relative flex flex-col items-center justify-center w-full h-52 bg-[#0B1120]/90 backdrop-blur-xl border border-white/10 rounded-2xl cursor-pointer hover:bg-[#0B1120]/80 transition-all duration-300 overflow-hidden">

                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

                    <div className="z-10 flex flex-col items-center">
                      {loading ? (
                        <div className="relative">
                          <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
                          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin relative z-10" />
                        </div>
                      ) : (
                        <div className="group-hover:translate-y-[-5px] transition-transform duration-300 flex flex-col items-center">
                          <div className="p-4 bg-white/5 rounded-2xl mb-4 text-emerald-400 shadow-lg shadow-emerald-500/10">
                            <Upload className="w-8 h-8" />
                          </div>
                          <p className="text-lg font-medium text-white mb-1">
                            {t('drop_text')}
                          </p>
                          <p className="text-sm text-slate-500">
                            {t('upload_limit')}
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".txt, .zip, application/zip"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={loading}
                    />
                  </label>
                </div>
              </div>

              {/* Bento Grid Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-0 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>

                {/* Card 1: Private */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors backdrop-blur-sm group relative overflow-hidden h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none" />
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Lock size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t('card_private_title')}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {t('card_private_desc')}
                  </p>
                </div>

                {/* Card 2: Deep Insights */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors backdrop-blur-sm group relative overflow-hidden h-full">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] -mr-16 -mb-16 pointer-events-none" />
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                    <BarChart3 size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t('card_insights_title')}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {t('card_insights_desc')}
                  </p>
                </div>

                {/* Card 3: No Login */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors backdrop-blur-sm group relative overflow-hidden h-full">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[60px] -ml-16 -mt-16 pointer-events-none" />
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                    <Fingerprint size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t('card_no_login_title')}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {t('card_no_login_desc')}
                  </p>
                </div>

                {/* Card 4: Instant Result */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors backdrop-blur-sm relative overflow-hidden h-full">
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[60px] -ml-16 -mb-16 pointer-events-none" />
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-yellow-400 group-hover:scale-110 transition-transform">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t('card_result_title')}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {t('card_result_desc')}
                  </p>
                </div>

                {/* Card 5: Offline Ready */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors backdrop-blur-sm relative overflow-hidden h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none" />
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-red-400 group-hover:scale-110 transition-transform">
                    <WifiOff size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t('card_offline_title')}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {t('card_offline_desc')}
                  </p>
                </div>

                {/* Card 6: Free Forever */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors backdrop-blur-sm relative overflow-hidden h-full">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-[60px] -ml-16 -mt-16 pointer-events-none" />
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-pink-400 group-hover:scale-110 transition-transform">
                    <Heart size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{t('card_free_title')}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {t('card_free_desc')}
                  </p>
                </div>

              </div>

              {/* Guide Section */}
              <div ref={guideRef} className="mt-24 opacity-80 hover:opacity-100 transition-opacity">
                <GuideSection />
              </div>

            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{t('report_title')}</h2>
                  <div className="flex items-center gap-2 text-slate-400">
                    <FileText size={16} />
                    <span className="font-mono">{fileName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {t('processing_complete')}
                </div>
              </div>
              <div ref={dashboardRef} className="rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
                <Dashboard stats={stats} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-32 pb-8 text-center text-sm text-slate-500 animate-fade-in relative z-10">
          <p>
            {t('developed_by')} <a href="https://github.com/furkanemiruzun" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-emerald-400 transition-colors font-medium">Furkan Emir Uzun</a>
          </p>
        </footer>

      </div>
    </div>
  );
}

export default App;
