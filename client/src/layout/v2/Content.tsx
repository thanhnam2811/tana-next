import React from 'react';
import { Layout } from 'antd';
import styles from './Layout.module.scss';

type ContentProps = React.ComponentProps<typeof Layout.Content>;

export function Content(props: ContentProps) {
	const classes = [styles.content];
	if (props.className) classes.push(props.className);

	return <Layout.Content {...props} className={classes.join(' ')} />;
}
