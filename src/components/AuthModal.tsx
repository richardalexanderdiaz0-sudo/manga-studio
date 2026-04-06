import React, { useState } from 'react';
import { Modal, Button, Input, useToast } from '@/src/components/ui';
import { useAuth } from '@/src/contexts/AuthContext';
import { Mail, Lock } from 'lucide-react';

export function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signInWithEmail, signUpWithEmail } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      onClose();
      toast(isLogin ? 'Bienvenido de nuevo' : 'Cuenta creada con éxito', 'success');
    } catch (error: any) {
      toast(error.message, 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isLogin ? 'Bienvenido' : 'Crear Cuenta'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          type="email" 
          placeholder="Correo electrónico" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="h-4 w-4" />}
          required
        />
        <Input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock className="h-4 w-4" />}
          required
        />
        <Button type="submit" className="w-full">
          {isLogin ? 'Ingresar' : 'Registrarse'}
        </Button>
        <div className="text-center text-sm">
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 hover:underline">
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Ingresa'}
          </button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">O</span>
          </div>
        </div>
        <Button type="button" variant="outline" className="w-full gap-2" onClick={async () => {
          await signIn();
          onClose();
        }}>
          Ingresar con Google
        </Button>
      </form>
    </Modal>
  );
}
