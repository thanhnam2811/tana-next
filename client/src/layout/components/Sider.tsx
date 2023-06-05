import classnames from 'classnames';
import { DetailedHTMLProps, HTMLAttributes, forwardRef } from 'react';
import styles from '../styles/Layout.module.scss';

interface Props {
	className?: string;
	align?: 'left' | 'right';
	children: React.ReactNode;
}

export const Sider = forwardRef<HTMLDivElement, Props & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>(
	({ align, className, children, ...props }, ref) => {
		const classes = [styles.sider];
		align && classes.push(styles[align]);
		className && classes.push(className);

		return (
			<div {...props} className={classnames(classes)} ref={ref}>
				<aside className={classnames(classes)}>{children}</aside>
			</div>
		);
	}
);
