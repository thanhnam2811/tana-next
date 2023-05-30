import { Layout, SiderProps } from 'antd';
import styles from './Layout.module.scss';

interface Props {
	fixed?: boolean;
	align?: 'left' | 'right';
}

export function Sider({ fixed, align, ...props }: Props & SiderProps) {
	const classes = [styles.sider];
	if (fixed) classes.push(styles.fixed);
	if (align === 'left') classes.push(styles.left);
	if (align === 'right') classes.push(styles.right);
	if (props.className) classes.push(props.className);

	return <Layout.Sider {...props} className={classes.join(' ')} />;
}
