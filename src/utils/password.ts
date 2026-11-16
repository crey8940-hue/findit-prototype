export type Strength = {score: 0 | 1 | 2 | 3 | 4;label: string;};

const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

export function passwordStrength(password: string): Strength {
  if (password.length < 8) return { score: 0, label: labels[0] };
  let score = 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score++;
  const s = Math.min(score, 4) as Strength['score'];
  return { score: s, label: labels[s] };
}

export function initialsOf(name: string): string {
  return name.
  split(' ').
  filter(Boolean).
  map((p) => p[0]).
  slice(0, 2).
  join('').
  toUpperCase();
}