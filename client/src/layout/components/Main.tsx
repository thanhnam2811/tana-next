import classnames from 'classnames';
import React, { DetailedHTMLProps, forwardRef, HTMLAttributes } from 'react';
import styles from '../styles/Layout.module.scss';

export interface MainProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	className?: string;
	children: React.ReactNode;
}

export const Main = forwardRef<HTMLElement, MainProps>(({ className, ...props }, ref) => {
	const classes = [styles.main];
	className && classes.push(className);

	return <main {...props} ref={ref} className={classnames(classes)} />;
});
