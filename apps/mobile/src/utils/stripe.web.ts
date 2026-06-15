import React from 'react';

export const StripeProvider: React.FC<{ children: React.ReactNode; publishableKey?: string }> = ({ children }) => {
  return React.createElement(React.Fragment, null, children);
};

export const useStripe = () => {
  return {
    initPaymentSheet: async () => ({ error: null }),
    presentPaymentSheet: async () => ({ error: null }),
  };
};
