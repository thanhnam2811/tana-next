import classnames from 'classnames';
import { DetailedHTMLProps, forwardRef, HTMLAttributes } from 'react';
import styles from '../styles/Layout.module.scss';

interface Props {
	className?: string;
	align?: 'left' | 'right';
	collapse?: boolean;
	children: React.ReactNode;
}

export const Sider = forwardRef<HTMLDivElement, Props & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>(
	({ align, className, children, collapse, ...props }, ref) => {
		const classes = [styles.sider];
		align && classes.push(styles[align]);
		collapse && classes.push(styles.collapse);
		className && classes.push(className);

		return (
			<div {...props} className={classnames(classes)} ref={ref}>
				<aside className={classnames(classes)}>{children}</aside>
			</div>
		);
	}
);
