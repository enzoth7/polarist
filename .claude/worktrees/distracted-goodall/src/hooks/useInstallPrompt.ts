import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

const isStandalone = () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
};

export const useInstallPrompt = () => {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isIOSDevice, setIsIOSDevice] = useState(false);

    useEffect(() => {
        // Already running as installed app — hide everything
        if (isStandalone()) {
            setIsInstallable(false);
            return;
        }

        // iOS: always show (manual instructions)
        if (isIOS()) {
            setIsIOSDevice(true);
            setIsInstallable(true);
            return;
        }

        // Android/Chrome: use beforeinstallprompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);
        };

        const handleAppInstalled = () => {
            setInstallPrompt(null);
            setIsInstallable(false);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        // Fallback: if no event fires within 3 seconds, show button anyway
        // (user might be on a supported browser that already dismissed the prompt)
        const fallbackTimer = setTimeout(() => {
            setIsInstallable(true);
        }, 3000);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
            clearTimeout(fallbackTimer);
        };
    }, []);

    const installApp = async () => {
        // iOS: show manual instructions via alert
        if (isIOSDevice || !installPrompt) {
            if (isIOSDevice) {
                alert(
                    '📲 Para instalar en iOS:\n\n' +
                    '1. Toca el ícono de Compartir (□↑)\n' +
                    '2. Selecciona "Agregar a pantalla de inicio"\n' +
                    '3. Toca "Agregar"'
                );
            } else {
                // Desktop Chrome/Edge — prompt not available, give manual instructions
                alert(
                    '📲 Para instalar:\n\n' +
                    'Busca el ícono de instalación (⊕) en la barra de direcciones de tu navegador,\n' +
                    'o abre el menú (⋮) y selecciona "Instalar aplicación".'
                );
            }
            return;
        }

        // Native install prompt (Android Chrome, some desktop browsers)
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }

        setInstallPrompt(null);
        setIsInstallable(false);
    };

    return { isInstallable, installApp, isIOSDevice };
};
