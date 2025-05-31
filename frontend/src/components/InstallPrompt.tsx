import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  }
}

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if the device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Handle the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Auto-dismiss after 10 seconds
    if (showInstallButton) {
      const timer = setTimeout(() => {
        setShowInstallButton(false);
      }, 10000);

      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [showInstallButton]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  if (!showInstallButton && !isIOS) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-2 sm:px-6 sm:py-3"
      >
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-xl shadow-2xl border border-white/20 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto">
            <div className="p-4 sm:p-6">
              {isIOS ? (
                <>
                  {!showIOSInstructions ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-white text-lg sm:text-xl font-bold mb-2">
                          Install Students Club
                        </h3>
                        <p className="text-white/90 text-sm sm:text-base">
                          Get the best experience by installing our app on your iPhone.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowIOSInstructions(true)}
                        className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border border-white/20"
                      >
                        <span>How to Install</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-white text-lg sm:text-xl font-bold">
                        Installation Steps
                      </h3>
                      <ol className="list-decimal list-inside space-y-2 text-white/90">
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-sm">1</span>
                          <span>Tap the Share button in your browser</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-sm">2</span>
                          <span>Scroll down and tap "Add to Home Screen"</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-sm">3</span>
                          <span>Tap "Add" to install the app</span>
                        </li>
                      </ol>
                      <button
                        onClick={() => setShowIOSInstructions(false)}
                        className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-lg transition-all duration-300"
                      >
                        Got it
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-white text-lg sm:text-xl font-bold mb-2">
                      Install Students Club
                    </h3>
                    <p className="text-white/90 text-sm sm:text-base">
                      Install our app for a better experience and quick access.
                    </p>
                  </div>
                  <button
                    onClick={handleInstallClick}
                    className="w-full sm:w-auto bg-white hover:bg-white/90 text-indigo-600 px-6 py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Install App</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}; 