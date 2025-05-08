/// <reference lib="dom" />

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import type { User } from '../types';
import { MESSAGES } from '../constants';
import { setLocalStorage } from '../utils';
import { supabase } from '@/config/supabase';
import { paymentService } from '@/lib/paymentService';
import { Plan } from '@/types';

// Hook para gerenciar autenticação
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkUserStatus = useCallback(async () => {
    try {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();
      if (supabaseUser) {
        const user: User = {
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          plano: 'vip',
          status: 'ativo',
        };
        setUser(user);
      }
    } catch (error) {
      console.error('Erro ao verificar status do usuário:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUserStatus();
  }, [checkUserStatus]);

  const login = async (email: string) => {
    try {
      setLoading(true);
      const mockUser: User = {
        id: '1',
        email,
        plano: 'vip',
        status: 'ativo',
      };
      setUser(mockUser);
      setLocalStorage('userEmail', email);
      toast.success(MESSAGES.SUCCESS.AUTHENTICATION);
      return true;
    } catch (error) {
      toast.error('Erro ao fazer login');
      toast.error(MESSAGES.ERRORS.AUTHENTICATION);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setLocalStorage('userEmail', null);
    navigate('/');
  };

  return { user, loading, login, logout };
}

// Hook para gerenciar posts
export function usePosts() {
  interface Post {
    id: string;
    image_url: string;
    description: string;
    created_at: string;
    likes: number;
    user_liked: boolean;
  }

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const mockPosts: Post[] = [
        {
          id: '1',
          image_url: 'https://example.com/image1.jpg',
          description: 'Post de exemplo 1',
          created_at: new Date().toISOString(),
          likes: 0,
          user_liked: false,
        },
      ];
      setPosts(mockPosts);
    } catch (error) {
      toast.error('Erro ao carregar posts');
      setError('Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  }, []);

  const likePost = async (postId: string) => {
    try {
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes: post.likes + 1,
              user_liked: true,
            };
          }
          return post;
        }),
      );
    } catch (error) {
      toast.error('Erro ao dar like');
      toast.error('Erro ao processar sua curtida');
    }
  };

  return { posts, loading, error, fetchPosts, likePost };
}

// Hook para gerenciar planos
export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    try {
      const data = await paymentService.getPlans();
      setPlans(data);
    } catch (error) {
      console.error('Erro ao buscar planos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading };
}

// Hook para gerenciar pagamentos
export function usePayment() {
  const [loading, setLoading] = useState(false);

  const createPayment = async (planId: string, userEmail: string) => {
    setLoading(true);
    try {
      const payment = await paymentService.createPayment(planId, userEmail);
      return payment;
    } catch (error) {
      console.error('Erro ao criar pagamento:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createPayment, loading };
}

export * from './useApp';
export * from './usePayment';
