declare global {
    interface Window {
      Paddle: {
        Setup: (options: { vendor: number }) => void;
        Checkout: {
          open: (options: { product: number; email?: string }) => void;
        };
      };
    }
  }
  
  export {};
  