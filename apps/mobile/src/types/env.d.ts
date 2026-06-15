declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    [key: string]: string | undefined;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};
