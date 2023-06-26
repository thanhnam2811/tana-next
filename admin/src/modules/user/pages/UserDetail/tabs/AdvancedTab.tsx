import { UserType } from '@modules/user/types';
import { Typography } from 'antd';

interface Props {
	user: UserType;
}

function AdvancedTab({ user }: Props) {
	console.log({ user });
	return <Typography.Text type="secondary">Advanced Tab</Typography.Text>;
}

export default AdvancedTab;
