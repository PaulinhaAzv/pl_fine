import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePayment } from '@/hooks';
import { toast } from 'react-hot-toast';

interface PaymentProps {
  planId: string;
  userEmail: string;
  _onSuccess?: () => void;
}

export const Payment = ({ planId, userEmail, _onSuccess }: PaymentProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { createPayment } = usePayment();

  const handlePayment = async () => {
    try {
      setLoading(true);
      const payment = await createPayment(planId, userEmail);
      if (payment) {
        toast.success('Pagamento iniciado com sucesso!');
        _onSuccess?.();
        navigate('/success');
      }
    } catch (error) {
      toast.error('Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-[#E91E63] hover:bg-[#E91E63]/90 text-white px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-[#E91E63]/20 hover:shadow-2xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processando...' : 'Pagar Agora'}
      </button>
    </div>
  );
};
