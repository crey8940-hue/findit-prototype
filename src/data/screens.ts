type ScreenState = {
  role?: 'user' | 'admin';
  loginRole?: 'user' | 'admin';
  reportType?: 'lost' | 'found';
};

export const screenStates: Record<string, ScreenState> = {
  scr_02rs67: { loginRole: 'admin' },
  scr_j87j8m: { role: 'user' },
  scr_7xyhl9: { role: 'user' },
  scr_s36u25: { role: 'user', reportType: 'lost' },
  scr_qzfuw0: { role: 'user', reportType: 'found' },
  scr_u8wf7w: { role: 'admin' },
  scr_t8nazv: { role: 'admin' },
  scr_0me15p: { role: 'admin', reportType: 'found' },
  scr_mx66uy: { role: 'admin', reportType: 'lost' },
  scr_j0ddvz: { role: 'admin' },
  scr_drl3eh: { role: 'admin' }
};