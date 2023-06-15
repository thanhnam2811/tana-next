import { GithubIcon, GoogleIcon } from '@assets/icons';

export interface AuthProvider {
	id: string;
	name: string;
	icon: string;
}

export const authProviders: AuthProvider[] = [
	{
		id: 'google',
		name: 'Google',
		icon: GoogleIcon.src,
	},
	{
		id: 'github',
		name: 'Github',
		icon: GithubIcon.src,
	},
];
