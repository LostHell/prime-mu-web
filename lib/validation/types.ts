export type AuthFormState = {
  message?: string;
  errors?: Record<string, string[]>;
};

export type UserPanelActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};
