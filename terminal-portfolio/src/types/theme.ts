export type ThemeTokens = {
  name: string;
  label: string;
  body: {
    background: string;
    texture?: string;
  };
  terminal: {
    background: string;
    border: string;
    glow: string;
  };
  text: {
    primary: string;
    secondary: string;
    prompt: string;
    accent: string;
    link: string;
  };
  controls: {
    buttonBg: string;
    buttonHover: string;
    buttonText: string;
    icon: string;
  };
};

