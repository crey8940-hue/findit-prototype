import React from 'react';

export const LOGO_URL = import.meta.env.BASE_URL + "2e82a905-d148-42c2-972b-0ddddb003dbe.png";


type LogoProps = {size?: number;className?: string;};

export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden rounded-full bg-white ring-2 ring-white/30 ${className}`}
      style={{ width: size, height: size }}>
      
      <img src={LOGO_URL} alt="FindIt logo" width={size} height={size} className="h-full w-full rounded-full object-cover" />
    </span>);

}