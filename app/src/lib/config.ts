import type { StartScreenPrompt } from '@openai/chatkit';

export const CHATKIT_API_URL =
  process.env.NEXT_PUBLIC_CHATKIT_API_URL ?? '/chatkit';

export const CHATKIT_API_DOMAIN_KEY =
  process.env.NEXT_PUBLIC_CHATKIT_API_DOMAIN_KEY ?? 'domain_pk_localhost_dev';

export const GREETING = "Let's build something great together";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: 'Get started',
    prompt: 'Help me create a marketing campaign',
    icon: 'sparkle',
  },
  {
    label: 'Brainstorm',
    prompt: 'Give me creative ideas for my product',
    icon: 'cube',
  },
  {
    label: 'Analyze',
    prompt: 'Review my marketing strategy',
    icon: 'calendar',
  },
];

export const PLACEHOLDER_INPUT = 'How can I help you today?';
