export type ExtractDefaultMessagesPayload = {
  defaultMessages: Record<string, string | Record<string, string>>;
  defaultLocaleFound?: string;
  availableLocales: string[];
};
