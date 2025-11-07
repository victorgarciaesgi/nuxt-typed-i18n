export type ExtractDefaultMessagesPayload = {
  defaultMessages: Record<string, string>;
  defaultLocaleFound?: string;
  availableLocales: string[];
};
