export const signInWithProvider = (provider: string) => {
  const backendBaseUrl = 'http://localhost:3000/auth';
  window.location.href = `http://localhost:3000/auth/signin?provider=google`;
};
