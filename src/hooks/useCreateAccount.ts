import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export type SignupForm = {
  firstName: string;
  lastName: string;
  studentId: string;
  email: string;
  program: string;
  year: string;
  password: string;
  confirm: string;
  terms: boolean;
};

export type SignupErrors = Partial<Record<keyof SignupForm, string>>;

const empty: SignupForm = {
  firstName: '',
  lastName: '',
  studentId: '',
  email: '',
  program: '',
  year: '',
  password: '',
  confirm: '',
  terms: false
};

function validate(f: SignupForm): SignupErrors {
  const e: SignupErrors = {};
  if (!f.firstName.trim()) e.firstName = 'Enter your first name.';
  if (!f.lastName.trim()) e.lastName = 'Enter your last name.';
  if (!/^\d{4}-\d{5}$/.test(f.studentId.trim())) e.studentId = 'Use the format 2023-01219.';
  if (!/^[^\s@]+@dnsc\.edu\.ph$/i.test(f.email.trim())) e.email = 'Use your @dnsc.edu.ph school email.';
  if (!f.program) e.program = 'Pick your program.';
  if (!f.year) e.year = 'Pick your year level.';
  if (f.password.length < 8) e.password = 'Use at least 8 characters.';
  if (!f.confirm) e.confirm = 'Re-enter your password.';else
  if (f.confirm !== f.password) e.confirm = 'Passwords don’t match.';
  if (!f.terms) e.terms = 'Please agree to the claim and release policy.';
  return e;
}

export function useCreateAccount() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState<SignupForm>(empty);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof SignupForm,>(key: K, value: SignupForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error('Please fix the highlighted fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const yearNum = form.year.charAt(0);
      const session = register({
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        subtitle: `Student · ${form.program} ${yearNum}`
      });
      setLoading(false);
      toast.success(`Account created. Welcome to FindIt, ${session.name.split(' ')[0]}!`);
      navigate('/app');
    }, 900);
  };

  return { form, errors, loading, set, submit };
}