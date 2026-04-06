/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Heart, ShieldCheck, Zap, Server, MessageSquare, Check, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { Button, Card, CardContent, CardHeader, CardTitle, Modal } from '@/src/components/ui';
import { useAuth } from '@/src/contexts/AuthContext';

const DONATION_AMOUNTS = [8, 10, 20, 50, 100];

export function Donation() {
  const { user } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showTerms, setShowTerms] = useState(false);

  const handleDonationClick = (amount: number) => {
    setSelectedAmount(amount);
    setShowTerms(true);
  };

  const confirmDonation = () => {
    if (!selectedAmount) return;
    
    const phoneNumber = '18293165263';
    const userName = user?.displayName || 'un usuario';
    const message = `Hola ${userName}, quiero donar ${selectedAmount} USD a nombre de la app MANGAVERSE`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    setShowTerms(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 pb-32">
      <div className="mx-auto max-w-2xl px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100 text-pink-600"
          >
            <Heart className="h-10 w-10 fill-current" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Apoya a MANGAVERSE</h1>
          <p className="mt-4 text-lg text-slate-600">
            Tu contribución nos ayuda a seguir creciendo y manteniendo la mejor experiencia de lectura.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <Card className="border-none shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-600">
                <ShieldCheck className="h-5 w-5" /> Beneficios para la App
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Server className="h-5 w-5 shrink-0 text-slate-400" />
                <p className="text-sm text-slate-600">Mantener los servidores activos y rápidos 24/7.</p>
              </div>
              <div className="flex gap-3">
                <Zap className="h-5 w-5 shrink-0 text-slate-400" />
                <p className="text-sm text-slate-600">Implementar nuevas funciones y mejoras técnicas.</p>
              </div>
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-slate-400" />
                <p className="text-sm text-slate-600">Corregir errores y optimizar la plataforma constantemente.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-600">
                <Check className="h-5 w-5" /> Beneficios para Ti
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <Heart className="h-5 w-5 shrink-0 text-slate-400" />
                <p className="text-sm text-slate-600">Satisfacción de apoyar un proyecto independiente.</p>
              </div>
              <div className="flex gap-3">
                <Zap className="h-5 w-5 shrink-0 text-slate-400" />
                <p className="text-sm text-slate-600">Acceso prioritario a nuevas funciones en desarrollo.</p>
              </div>
              <div className="flex gap-3">
                <MessageSquare className="h-5 w-5 shrink-0 text-slate-400" />
                <p className="text-sm text-slate-600">Tu opinión tendrá más peso en futuras actualizaciones.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Selecciona un monto para donar</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {DONATION_AMOUNTS.map((amount) => (
              <button
                key={amount}
                onClick={() => handleDonationClick(amount)}
                className="group relative flex h-24 w-24 flex-col items-center justify-center rounded-2xl border-2 border-slate-200 bg-white transition-all hover:border-indigo-600 hover:bg-indigo-50 active:scale-95"
              >
                <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600">USD</span>
                <span className="text-2xl font-black text-slate-900 group-hover:text-indigo-600">${amount}</span>
              </button>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500 italic">
            * El monto se ajustará según la moneda de tu país al procesar.
          </p>
        </div>

        <div className="rounded-2xl bg-indigo-50 p-6 text-center">
          <p className="text-sm text-indigo-900 font-medium">
            "Gracias por ser parte de MANGAVERSE. Cada donación, sin importar el tamaño, marca la diferencia."
          </p>
        </div>
      </div>

      <Modal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Términos y Políticas de Donación"
      >
        <div className="space-y-4 text-slate-600">
          <div className="rounded-xl bg-amber-50 p-4 text-amber-800 text-sm border border-amber-100">
            <p className="font-bold mb-2">Aviso Importante:</p>
            <p>
              Las donaciones son **totalmente voluntarias**. Al no donar, la aplicación seguirá siendo **gratis para todos** sin restricciones de contenido.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">1. Naturaleza de la Donación</h4>
            <p className="text-sm">
              Al realizar una donación, usted reconoce que se trata de un acto de apoyo voluntario y no de una compra de servicios o bienes.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">2. Uso de los Fondos</h4>
            <p className="text-sm">
              Los fondos recaudados se destinarán exclusivamente al mantenimiento de servidores, pago de APIs, corrección de errores y desarrollo de nuevas funcionalidades para MANGAVERSE.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">3. Política de Reembolso</h4>
            <p className="text-sm">
              Debido a la naturaleza de las donaciones voluntarias, no se ofrecen reembolsos una vez procesada la transacción.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900">4. Privacidad</h4>
            <p className="text-sm">
              Su información personal será tratada con confidencialidad y solo se utilizará para coordinar la donación vía WhatsApp de forma segura.
            </p>
          </div>

          <div className="pt-4 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowTerms(false)}>
              Cancelar
            </Button>
            <Button className="flex-1 bg-indigo-600" onClick={confirmDonation}>
              Aceptar y Continuar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
