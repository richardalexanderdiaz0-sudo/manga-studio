/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileText, Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui';

export function Legal() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 pb-32">
      <div className="mx-auto max-w-3xl px-4">
        <Link to="/">
          <Button variant="ghost" className="mb-8 gap-2">
            <ArrowLeft className="h-4 w-4" /> Volver al Inicio
          </Button>
        </Link>

        <div className="space-y-12">
          <section id="terminos">
            <Card className="border-none shadow-lg">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">Términos de Servicio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-600">
                <p>Bienvenido a MANGAVERSE. Al utilizar nuestra aplicación, usted acepta los siguientes términos:</p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900">1. Uso del Contenido</h4>
                    <p className="text-sm">MANGAVERSE es una plataforma de lectura. El contenido es propiedad de sus respectivos autores y editoriales. El uso de esta app es solo para fines personales y no comerciales.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">2. Registro de Usuario</h4>
                    <p className="text-sm">Usted es responsable de mantener la confidencialidad de su cuenta y contraseña. Nos reservamos el derecho de suspender cuentas que violen nuestras normas de comunidad.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">3. Donaciones</h4>
                    <p className="text-sm">Las donaciones son voluntarias y no reembolsables. No otorgan propiedad sobre la aplicación ni derechos especiales de administración.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">4. Limitación de Responsabilidad</h4>
                    <p className="text-sm">No nos hacemos responsables por interrupciones temporales del servicio o pérdida de datos debido a causas técnicas fuera de nuestro control.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section id="privacidad">
            <Card className="border-none shadow-lg">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">Política de Privacidad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-600">
                <p>En MANGAVERSE, su privacidad es nuestra prioridad. Así manejamos sus datos:</p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-900">1. Datos Recopilados</h4>
                    <p className="text-sm">Solo recopilamos información básica como su nombre, correo electrónico y preferencias de lectura para mejorar su experiencia.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">2. Uso de la Información</h4>
                    <p className="text-sm">Sus datos se utilizan para sincronizar su biblioteca entre dispositivos y enviarle notificaciones relevantes sobre nuevos capítulos.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">3. Terceros</h4>
                    <p className="text-sm">No vendemos ni compartimos su información personal con terceros con fines publicitarios.</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">4. Sus Derechos</h4>
                    <p className="text-sm">Usted puede solicitar la eliminación de su cuenta y todos sus datos asociados en cualquier momento desde la configuración de su perfil.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
