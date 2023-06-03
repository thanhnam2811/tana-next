import classnames from 'classnames';
import { DetailedHTMLProps, HTMLAttributes, forwardRef } from 'react';
import styles from './Layout.module.scss';

interface Props {
	className?: string;
	children: React.ReactNode;
}

export const Content = forwardRef<HTMLDivElement, Props & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>(
	({ className, ...props }, ref) => {
		const classes = [styles.content];
		className && classes.push(className);

		return <div {...props} ref={ref} className={classnames(classes)} />;
	}
);
