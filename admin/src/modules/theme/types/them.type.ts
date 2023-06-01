export enum ColorsEnum {
	Primary = 'primary',
	Secondary = 'secondary',
	Success = 'success',
	Danger = 'danger',
	Warning = 'warning',
	Info = 'info',
}

export enum BackgroundColorsEnum {
	Dark = 'dark',
	Light = 'light',
}

export interface ITheme {
	colors: Record<ColorsEnum, string>;
	bgColors: Record<BackgroundColorsEnum, string>;
}
