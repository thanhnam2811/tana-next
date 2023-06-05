export default interface ILayoutData {
	path: string;
	title: string;
	icon?: React.ReactNode;
	element?: React.ReactNode;
	children?: ILayoutData[];
}
