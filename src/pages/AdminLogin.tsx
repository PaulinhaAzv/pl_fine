import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { debugAdminCheck } from '../lib/supabase';
import { SupabaseError } from '@/types';
import { logger } from '@/utils/logger';

interface AdminData {
  email: string;
  is_admin: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    logger.info('Iniciando processo de login', { email: credentials.email });

    try {
      // Autenticação com Supabase
      logger.info('Tentando autenticar com Supabase Auth');
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) {
        logger.error('Erro na autenticação', { error: authError });
        let errorMessage = 'Erro ao fazer login. ';
        if (authError.message.includes('Invalid login credentials')) {
          errorMessage = 'Email ou senha incorretos.';
        } else if (authError.message.includes('Email not confirmed')) {
          errorMessage = 'Por favor, confirme seu email antes de fazer login.';
        }
        setError(errorMessage);
        toast.error(errorMessage);
        throw authError;
      }

      logger.info('Autenticação bem-sucedida', { data: authData });

      // Debug da verificação de admin
      const debugResult = await debugAdminCheck(credentials.email);
      logger.info('Debug da verificação de admin', { result: debugResult });

      // Verificar se o usuário é admin
      logger.info('Verificando status de admin na tabela clientes_vip');
      const { data: adminData, error: adminError } = await supabase
        .from('clientes_vip')
        .select('*')
        .eq('email', credentials.email)
        .single();

      logger.info('Resultado da consulta admin', { data: adminData, error: adminError });

      if (adminError) {
        logger.error('Erro ao verificar status de admin', { error: adminError });
        const errorMessage =
          'Erro ao verificar permissões de administrador. Detalhes: ' + adminError.message;
        setError(errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const typedAdminData = adminData as AdminData;

      if (!typedAdminData?.is_admin) {
        logger.error('Usuário não é admin', { data: typedAdminData });
        const errorMessage = 'Acesso restrito a administradores';
        setError(errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      logger.info('Usuário confirmado como admin', { data: typedAdminData });
      localStorage.setItem('userEmail', credentials.email);
      toast.success('Login realizado com sucesso!');
      navigate('/admin');
    } catch (error) {
      const supabaseError = error as SupabaseError;
      logger.error('Erro detalhado no login', { error: supabaseError });
      const errorMessage = supabaseError.message || 'Erro ao fazer login. Tente novamente.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-black/40 backdrop-blur-lg p-8 rounded-2xl border border-[#E91E63]/20 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#E91E63]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="bx bxs-user text-[#E91E63] text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Login Administrativo</h2>
          <p className="text-white/60">Acesse sua conta de administrador</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="bx bx-envelope text-[#E91E63] text-xl"></i>
            </div>
            <input
              type="email"
              value={credentials.email}
              onChange={e => setCredentials({ ...credentials, email: e.target.value })}
              className="w-full bg-black/50 border border-[#E91E63]/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/60"
              placeholder="Email"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="bx bx-lock-alt text-[#E91E63] text-xl"></i>
            </div>
            <input
              type="password"
              value={credentials.password}
              onChange={e => setCredentials({ ...credentials, password: e.target.value })}
              className="w-full bg-black/50 border border-[#E91E63]/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/60"
              placeholder="Senha"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E91E63] hover:bg-[#E91E63]/90 text-white py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-[#E91E63]/20 hover:shadow-2xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <i className="bx bx-loader-alt animate-spin text-xl"></i>
                <span>Entrando...</span>
              </>
            ) : (
              <>
                <i className="bx bx-log-in text-xl"></i>
                <span>Entrar</span>
              </>
            )}
          </button>

          <div className="text-center">
            <Link
              to="/admin/register"
              className="text-[#E91E63] hover:text-[#E91E63]/90 transition-colors text-sm"
            >
              Criar conta de administrador
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
