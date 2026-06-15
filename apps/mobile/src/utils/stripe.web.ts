import React from 'react';

export const StripeProvider: React.FC<{ children: React.ReactNode; publishableKey?: string }> = ({ children }) => {
  return React.createElement(React.Fragment, null, children);
};

export const useStripe = () => {
  return {
    initPaymentSheet: async () => { await Promise.resolve(); return { error: null }; },
    presentPaymentSheet: async () => { await Promise.resolve(); return { error: null }; },
  };
};
