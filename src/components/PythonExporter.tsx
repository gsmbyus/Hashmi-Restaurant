import React, { useState } from 'react';
import { 
  Code2, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  FileCode, 
  FileText, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { PYTHON_MAIN_SOURCE, REQUIREMENTS_TXT, BUILD_EXE_BAT, RUN_BAT, README_URDU } from '../data/pythonSourceCode';

export const PythonExporter: React.FC = () => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeFileTab, setActiveFileTab] = useState<'main.py' | 'requirements.txt' | 'build_exe.bat' | 'run.bat' | 'README.md'>('main.py');

  const fileContents: Record<string, string> = {
    'main.py': PYTHON_MAIN_SOURCE,
    'requirements.txt': REQUIREMENTS_TXT,
    'build_exe.bat': BUILD_EXE_BAT,
    'run.bat': RUN_BAT,
    'README.md': README_URDU,
  };

  const handleDownload = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = (filename: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const handleDownloadAllZip = () => {
    // Download each file in sequence
    Object.entries(fileContents).forEach(([filename, content], index) => {
      setTimeout(() => {
        handleDownload(filename, content);
      }, index * 300);
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#181A20] border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>پائیتھن CustomTkinter + SQLite سنگل فائل سورس کوڈ</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              مکمل پائیتھن سورس کوڈ و ونڈوز EXE بلڈر
            </h2>
            <p className="text-xs md:text-sm text-gray-400 mt-1 max-w-2xl leading-relaxed">
              سنگل فائل <code className="text-blue-400 font-mono bg-[#0F1115] border border-gray-800 px-2 py-0.5 rounded">main.py</code> میں تمام ماڈیولز (لاگ ان، ایڈمن، کمرے، بکنگز، انوائسز، فنانس، رپورٹنگ، اور SQLite ڈیٹا بیس) موجود ہیں۔
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-download-main-py"
              onClick={() => handleDownload('main.py', PYTHON_MAIN_SOURCE)}
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-900/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>main.py ڈاؤن لوڈ کریں</span>
            </button>

            <button
              id="btn-download-all-package"
              onClick={handleDownloadAllZip}
              className="px-4 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>تمام فائلز ڈاؤن لوڈ کریں (All Files)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#181A20] border border-gray-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span>1. پائیتھن میں چلانے کا طریقہ:</span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            فائلز ڈاؤن لوڈ کریں اور ٹرمینل میں یہ کمانڈ چلائیں:
          </p>
          <pre className="bg-[#0F1115] p-2.5 rounded-lg text-blue-400 font-mono text-[11px] overflow-x-auto border border-gray-800" dir="ltr">
            pip install -r requirements.txt{'\n'}python main.py
          </pre>
        </div>

        <div className="bg-[#181A20] border border-gray-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>2. ونڈوز EXE فائل بنانے کا طریقہ:</span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            <code className="text-purple-300 font-mono">build_exe.bat</code> پر ڈبل کلک کریں۔ یہ خودکار طریقے سے PyInstaller سے پورٹیبل EXE تیار کرے گا:
          </p>
          <pre className="bg-[#0F1115] p-2.5 rounded-lg text-purple-300 font-mono text-[11px] overflow-x-auto border border-gray-800" dir="ltr">
            pyinstaller --noconsole --onefile main.py
          </pre>
        </div>

        <div className="bg-[#181A20] border border-gray-800 p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>3. ایڈمن لاگ اِن کی تفصیلات:</span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            پہلی بار سافٹ ویئر شروع کرنے پر ڈیفالٹ لاگ اِن:
          </p>
          <div className="bg-[#0F1115] p-2 rounded-lg font-mono text-[11px] text-gray-300 space-y-1 border border-gray-800" dir="ltr">
            <div>Username: <span className="text-blue-400 font-bold">admin</span></div>
            <div>Password: <span className="text-blue-400 font-bold">admin123</span></div>
          </div>
        </div>
      </div>

      {/* Code Browser & Viewer */}
      <div className="bg-[#181A20] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Tab Selection */}
        <div className="bg-[#0F1115] border-b border-gray-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            {(['main.py', 'requirements.txt', 'build_exe.bat', 'run.bat', 'README.md'] as const).map((fname) => (
              <button
                key={fname}
                onClick={() => setActiveFileTab(fname)}
                className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-semibold flex items-center gap-2 transition-colors ${
                  activeFileTab === fname
                    ? 'bg-blue-600 text-white shadow shadow-blue-900/30'
                    : 'bg-[#181A20] text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{fname}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(activeFileTab, fileContents[activeFileTab])}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedFile === activeFileTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400">کاپی ہو گیا!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>کوڈ کاپی کریں</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleDownload(activeFileTab, fileContents[activeFileTab])}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow shadow-blue-900/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ڈاؤن لوڈ ({activeFileTab})</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-[#0F1115] overflow-x-auto max-h-[550px] overflow-y-auto font-mono text-xs text-gray-300 leading-relaxed selection:bg-blue-500/30 selection:text-white" dir="ltr">
          <pre className="whitespace-pre">
            {fileContents[activeFileTab]}
          </pre>
        </div>
      </div>
    </div>
  );
};
