"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "predim_nec_pwa_dismissed";

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Retrasa el aviso para no tapar el primer cálculo en móvil.
    const hydrationTask = window.setTimeout(() => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        ("standalone" in window.navigator &&
          Boolean(
            (window.navigator as Navigator & { standalone?: boolean })
              .standalone,
          ));

      setIsStandalone(standalone);
      setIsIOS(/iPad|iPhone|iPod/.test(window.navigator.userAgent));
      setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1");

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
      }
    }, 8000);

    function onBeforeInstall(event: Event) {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => {
      window.clearTimeout(hydrationTask);
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    };
  }, []);

  if (isStandalone || dismissed) {
    return null;
  }

  if (!deferredPrompt && !isIOS) {
    return null;
  }

  async function install() {
    if (!deferredPrompt) {
      return;
    }
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  function dismiss() {
    window.localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className="no-print fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:bottom-4 sm:left-auto">
      <div className="flex items-start gap-3">
        <BrandLogo size={40} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-950">
            Instalar PreDim NEC
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            {isIOS
              ? 'En iPhone/iPad: toca Compartir y luego "Añadir a pantalla de inicio".'
              : "Úsala como app en tu dispositivo, con acceso rápido y mejor soporte offline."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {!isIOS && deferredPrompt && (
              <button
                type="button"
                onClick={install}
                className="rounded-lg bg-[#E65100] px-3 py-2 text-xs font-bold text-white hover:bg-[#C84600]"
              >
                Instalar app
              </button>
            )}
            <button
              type="button"
              onClick={dismiss}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Ahora no
            </button>
          </div>
        </div>
        <button
          type="button"
          aria-label="Cerrar aviso de instalación"
          onClick={dismiss}
          className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X aria-hidden="true" size={16} />
        </button>
      </div>
    </div>
  );
}
