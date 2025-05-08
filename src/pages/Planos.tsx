import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, MessageSquare, Mail, Crown, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

declare global {
  interface Window {
    location: Location;
  }
}

export function Planos() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email') || '';
    const plano = urlParams.get('plano') || '';

    const emailInput = document.getElementById('email') as HTMLInputElement;
    const planoInput = document.getElementById('plano') as HTMLInputElement;
    if (emailInput) emailInput.value = email;
    if (planoInput) planoInput.value = plano;

    // Simular carregamento para melhor UX
    if (email && plano) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function enviarCanal(canal: 'telegram' | 'whatsapp' | 'email') {
    try {
      const form = document.getElementById('canalForm') as HTMLFormElement;
      if (!form) return;

      const canalInput = document.getElementById('canal_entrega') as HTMLInputElement;
      if (canalInput) canalInput.value = canal;

      const formData = new FormData(form);
      const dados = Object.fromEntries(formData);

      const { error } = await supabase.from('clientes_vip').insert([dados]);

      if (error) throw error;

      const redirectUrls = {
        telegram: 'https://t.me/PaulaAzevedo_Bot?start=vip',
        whatsapp: 'https://wa.me/553131931679?text=Quero+acesso+VIP+confirmado',
        email: 'mailto:suporte@paulaazevedo.site?subject=Acesso%20VIP&body=Confirmado',
      };

      window.location.href = redirectUrls[canal];
    } catch (error) {
      console.error('Erro ao registrar canal:', error);
      toast.error('Erro ao registrar sua escolha. Tente novamente.');
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const isConfirmation = urlParams.get('email') && urlParams.get('plano');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <Loader2 className="w-12 h-12 text-[#E91E63]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Confirmando seu acesso...</h2>
          <p className="text-white/60">Por favor, aguarde enquanto processamos sua compra.</p>
        </div>
      </div>
    );
  }

  if (isConfirmation) {
    return (
      <div className="min-h-screen bg-black">
        <div className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[#E91E63] blur-[120px] opacity-5"></div>
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-[#E91E63]/20 shadow-xl relative z-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-[#E91E63]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="text-[#E91E63]" size={32} />
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">Acesso Confirmado!</h1>
                  <p className="text-white/60">Escolha como deseja receber seu conteúdo VIP:</p>
                </div>

                <form id="canalForm" className="hidden">
                  <input type="hidden" name="email" id="email" />
                  <input type="hidden" name="telegram_id" />
                  <input type="hidden" name="whatsapp" />
                  <input type="hidden" name="canal_entrega" id="canal_entrega" />
                  <input type="hidden" name="status" value="pago" />
                  <input type="hidden" name="plano" id="plano" />
                </form>

                <div className="space-y-4">
                  <button
                    onClick={() => enviarCanal('telegram')}
                    className="w-full inline-flex justify-center items-center px-6 py-4 text-base font-medium rounded-full text-white bg-[#E91E63] hover:bg-[#E91E63]/90 transition-all duration-300 shadow-lg hover:shadow-[#E91E63]/20 hover:shadow-2xl transform hover:-translate-y-0.5"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Receber no Telegram
                  </button>

                  <button
                    onClick={() => enviarCanal('whatsapp')}
                    className="w-full inline-flex justify-center items-center px-6 py-4 text-base font-medium rounded-full text-white bg-[#E91E63] hover:bg-[#E91E63]/90 transition-all duration-300 shadow-lg hover:shadow-[#E91E63]/20 hover:shadow-2xl transform hover:-translate-y-0.5"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Receber no WhatsApp
                  </button>

                  <button
                    onClick={() => enviarCanal('email')}
                    className="w-full inline-flex justify-center items-center px-6 py-4 text-base font-medium rounded-full text-white bg-[#E91E63] hover:bg-[#E91E63]/90 transition-all duration-300 shadow-lg hover:shadow-[#E91E63]/20 hover:shadow-2xl transform hover:-translate-y-0.5"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Receber por Email
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Planos</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Escolha o melhor plano para você
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-8">
          {/* Plano Básico */}
          <div className="flex flex-col rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10">
            <div className="flex items-center justify-between gap-x-4">
              <h3 className="text-lg font-semibold leading-8 text-gray-900">Plano Básico</h3>
              <p className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                Mais Popular
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Acesso ao conteúdo básico e exclusivo
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">R$ 29,90</span>
              <span className="text-sm font-semibold leading-6 text-gray-600">/mês</span>
            </p>
            <a
              href="https://openpix.com.br/pay/dca7fd01-bd6e-4a2d-bb7c-16f3ad07e8b2"
              className="mt-8 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Assinar Plano Básico
            </a>
          </div>

          {/* Plano VIP */}
          <div className="flex flex-col rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10">
            <div className="flex items-center justify-between gap-x-4">
              <h3 className="text-lg font-semibold leading-8 text-gray-900">Plano VIP</h3>
              <p className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                Acesso Total
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-600">
              Acesso completo a todo o conteúdo exclusivo
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">R$ 59,90</span>
              <span className="text-sm font-semibold leading-6 text-gray-600">/mês</span>
            </p>
            <a
              href="https://openpix.com.br/pay/19b39aee-9a21-4568-bc59-2432a0b1912e"
              className="mt-8 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Assinar Plano VIP
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
