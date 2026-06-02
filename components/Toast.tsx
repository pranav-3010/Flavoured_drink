'use client';

import React, { useState, useEffect } from 'react';
import { ToastMessage, onToastChange } from '@/utils/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Info, X } from 'lucide-react';

export function Toast() {
  const [toasts, setToasts] = useState<Map<string, ToastMessage>>(new Map());

  useEffect(() => {
    const unsubscribe = onToastChange((toast) => {
      setToasts((prev) => {
        const newToasts = new Map(prev);
        if (toast.message === '') {
          newToasts.delete(toast.id);
        } else {
          newToasts.set(toast.id, toast);
        }
        return newToasts;
      });
    });

    return unsubscribe;
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {Array.from(toasts.values()).map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  toast: ToastMessage;
}

function ToastItem({ toast }: ToastItemProps) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      transition={{ duration: 0.3 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border pointer-events-auto ${getBgColor()}`}
    >
      {getIcon()}
      <span className={`text-sm font-medium ${getTextColor()}`}>{toast.message}</span>
    </motion.div>
  );
}
