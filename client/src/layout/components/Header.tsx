import classnames from 'classnames';
import React, { DetailedHTMLProps, forwardRef, HTMLAttributes } from 'react';
import styles from '../styles/Layout.module.scss';

import { theme } from 'antd';

interface Props {
	className?: string;
	children?: React.ReactNode;
}

export const Header = forwardRef<HTMLElement, Props & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>(
	({ className, ...props }, ref) => {
		const { token } = theme.useToken();

		const classes = [styles.header];
		className && classes.push(className);

		return (
			<header
				{...props}
				ref={ref}
				className={classnames(classes)}
				style={{ backgroundColor: token.colorBgContainer, ...props?.style }}
			/>
		);
	}
);

export const HeaderLeft = forwardRef<
	HTMLDivElement,
	Props & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
>(({ className, ...props }, ref) => {
	const classes = [styles.left];
	className && classes.push(className);

	return <div {...props} ref={ref} className={classnames(classes)} />;
});

export const HeaderRight = forwardRef<
	HTMLDivElement,
	Props & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
>(({ className, ...props }, ref) => {
	const classes = [styles.right];
	className && classes.push(className);

	return <div {...props} ref={ref} className={classnames(classes)} />;
});

export const HeaderCenter = forwardRef<
	HTMLDivElement,
	Props & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>
>(({ className, ...props }, ref) => {
	const classes = [styles.center];
	className && classes.push(className);

	return <div {...props} ref={ref} className={classnames(classes)} />;
});
