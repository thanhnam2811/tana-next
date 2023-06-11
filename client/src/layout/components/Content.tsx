import classnames from 'classnames';
import { DetailedHTMLProps, HTMLAttributes, forwardRef } from 'react';
import styles from '../styles/Layout.module.scss';

interface Props {
	className?: string;
	fixed?: boolean;
	children: React.ReactNode;
}

export const Content = forwardRef<HTMLDivElement, Props & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>(
	({ className, fixed, ...props }, ref) => {
		const classes = [styles.content];
		className && classes.push(className);

		fixed && classes.push(styles.fixed);

		return <div {...props} ref={ref} className={classnames(classes)} />;
	}
);
