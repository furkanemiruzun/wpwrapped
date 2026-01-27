import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, MessageCircle, FileText, ChevronRight, Github, Globe, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import JSZip from 'jszip';
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

    // Simulate slight delay for "crunching" animation feels
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
        // Use the first txt file found
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

  return (
    <div className="min-h-screen bg-background text-text selection:bg-cta/30 selection:text-white font-sans relative">
      <AnimatePresence>
        {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      </AnimatePresence>

      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cta/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">

        {/* Navbar */}
        <nav className="flex justify-between items-center mb-12 animate-fade-in">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="p-2 bg-gradient-to-br from-cta to-emerald-700 rounded-lg shadow-lg shadow-cta/20">
              <MessageCircle className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Chat<span className="text-cta">Wrapp</span></h1>
          </div>
          <div className="flex items-center gap-3">
            {stats && (
              <button
                onClick={reset}
                className="text-sm text-muted hover:text-white transition-colors"
              >
                {t('analyze_another')}
              </button>
            )}

            <button
              onClick={() => setShowPrivacy(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-sm font-medium text-muted hover:text-white"
            >
              <Shield size={16} />
              {t('privacy_policy')}
            </button>

            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-sm font-medium"
            >
              <Globe size={16} />
              {i18n.language.toUpperCase()}
            </button>

            <a href="https://github.com/furkanemiruzun" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <Github size={20} />
            </a>
          </div>
        </nav>

        <AnimatePresence mode="wait">
          {!stats ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center pt-10 md:pt-20"
            >
              <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-cta/30 bg-cta/10 text-cta text-sm font-medium animate-slide-up">
                {t('hero_badge')}
              </div>

              <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 pb-2 leading-tight" dangerouslySetInnerHTML={{ __html: t('hero_title') }} />

              <p className="text-xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
                {t('hero_subtitle')}
              </p>

              {/* Upload Area */}
              <div className="relative group max-w-md mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-cta to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative glass-card p-1">
                  <label
                    className={`
                        flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
                        ${loading ? 'border-cta bg-cta/5' : 'border-white/10 hover:border-cta/50 hover:bg-white/5'}
                      `}
                  >
                    <div className="flex flex-col items-center justify-center pb-4 pt-4">
                      {loading ? (
                        <div className="w-10 h-10 border-4 border-cta border-t-transparent rounded-full animate-spin mb-3" />
                      ) : (
                        <Upload className="w-10 h-10 mb-3 text-muted group-hover:text-cta transition-colors" />
                      )}
                      <p className="text-sm text-muted">
                        {loading ? t('crunching') : t('drop_text')}
                      </p>
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

              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left opacity-60 hover:opacity-100 transition-opacity duration-500">
                <div className="p-4 border border-white/5 rounded-xl bg-white/5">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 text-purple-400">
                    <FileText size={20} />
                  </div>
                  <h3 className="font-semibold mb-2">{t('card_private_title')}</h3>
                  <p className="text-sm text-muted">{t('card_private_desc')}</p>
                </div>
                <div className="p-4 border border-white/5 rounded-xl bg-white/5">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                    <MessageCircle size={20} />
                  </div>
                  <h3 className="font-semibold mb-2">{t('card_insights_title')}</h3>
                  <p className="text-sm text-muted">{t('card_insights_desc')}</p>
                </div>
                <div className="p-4 border border-white/5 rounded-xl bg-white/5">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 text-green-400">
                    <ChevronRight size={20} />
                  </div>
                  <h3 className="font-semibold mb-2">{t('card_result_title')}</h3>
                  <p className="text-sm text-muted">{t('card_result_desc')}</p>
                </div>
              </div>

              {/* Guide Section */}
              <GuideSection />

            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t('report_title')} <span className="text-cta font-mono text-lg font-normal ml-2">{fileName}</span></h2>
                <span className="text-sm text-muted bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  {t('generated_now')}
                </span>
              </div>
              <Dashboard stats={stats} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-20 text-center text-sm text-muted animate-fade-in">
          <div className="flex justify-center md:hidden mb-4">
            <button
              onClick={() => setShowPrivacy(true)}
              className="text-muted hover:text-white transition-colors"
            >
              {t('privacy_policy')}
            </button>
          </div>
          <p>
            {t('developed_by')} <a href="https://github.com/furkanemiruzun" target="_blank" rel="noopener noreferrer" className="text-cta hover:text-white transition-colors font-medium">Furkan Emir Uzun</a>
          </p>
        </footer>

      </div>
    </div>
  );
}

export default App;
