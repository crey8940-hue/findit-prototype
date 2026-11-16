import React from 'react';

export const BACKGROUND_URL = "/435c2585-474b-4091-aa8b-d6363dbc871e.jpg";


// Campus photo + navy tint as real layers (exports to Figma as an image + rectangle).
export function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <img src={BACKGROUND_URL} alt="" className="h-full w-full object-cover object-center" />
      <div className="absolute inset-0 bg-[rgba(11,36,71,0.38)]" />
    </div>);

}