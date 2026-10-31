const TEAM_IMAGES: Record<string, string> = {
  football: '/footballteam.jpg',
  basketball: '/basketteam.jpg',
  swimming: '/swimmingteam.jpg',
  padel: '/padelcourt.jpg',
};

const PITCH_IMAGES: Record<string, string> = {
  football: '/bigfootballpitch.jpg',
  basketball: '/basketpitch.jpg',
  swimming: '/pool.jpg',
  padel: '/padelpitch.jpg',
};

const COURT_IMAGES: Record<string, string> = {
  football: '/bigfootballpitch.jpg',
  basketball: '/basketcourt.jpg',
  swimming: '/pool.jpg',
  padel: '/padelcourt.jpg',
};

export function sportTeamImage(sport: string): string {
  return TEAM_IMAGES[sport.toLowerCase()] ?? '/bigfootballpitch.jpg';
}

export function sportPitchImage(sport: string): string {
  return PITCH_IMAGES[sport.toLowerCase()] ?? '/bigfootballpitch.jpg';
}

export function sportCourtImage(sport: string): string {
  return COURT_IMAGES[sport.toLowerCase()] ?? '/bigfootballpitch.jpg';
}
