import { Spin, SpinProps } from 'antd';

export function FullscreenSpin(props: SpinProps) {
	return (
		<div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<Spin {...props} />
		</div>
	);
}
