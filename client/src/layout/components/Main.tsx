import classnames from 'classnames';
import { DetailedHTMLProps, forwardRef, HTMLAttributes } from 'react';
import styles from '../styles/Layout.module.scss';

interface Props {
	className?: string;
	children: React.ReactNode;
}

export const Main = forwardRef<HTMLElement, Props & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>(
	({ className, ...props }, ref) => {
		const classes = [styles.main];
		className && classes.push(className);

		return <main {...props} ref={ref} className={classnames(classes)} />;
	}
);
