import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

export const Pagamento: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const plano = searchParams.get('plano');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!plano || !email) {
      toast.error('Informações de pagamento inválidas');
      navigate('/planos');
    }
  }, [plano, email, navigate]);

  const handlePayment = async () => {
    try {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Por favor, faça login para continuar');
        navigate('/login');
        return;
      }

      // Redirecionar para o checkout do OpenPix
      const openpixUrl =
        plano === 'basico'
          ? 'https://openpix.com.br/pay/dca7fd01-bd6e-4a2d-bb7c-16f3ad07e8b2'
          : 'https://openpix.com.br/pay/19b39aee-9a21-4568-bc59-2432a0b1912e';

      window.location.href = openpixUrl;
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error('Ocorreu um erro ao processar seu pagamento');
    } finally {
      setLoading(false);
    }
  };

  if (!plano || !email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-text mb-8 text-center">Finalizar Compra</h1>

        <div className="bg-card p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-text mb-4">Resumo do Pedido</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-text/80">Plano:</span>
              <span className="text-text font-semibold">{plano.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text/80">Email:</span>
              <span className="text-text font-semibold">{email}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full mt-6 bg-accent text-white py-3 px-4 rounded hover:bg-accent/90 transition-colors disabled:opacity-50"
            aria-label="Finalizar pagamento"
          >
            {loading ? 'Processando...' : 'Finalizar Pagamento'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagamento;
