import { getPrivacyOption, privacyOptions } from '@assets/data';
import { PrivacyType } from '@interfaces';
import { Button, Dropdown, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import Icon from '@ant-design/icons';

interface Props {
	value?: PrivacyType;
	onChange?: (value: PrivacyType) => any;
}

export function PrivacyDropdown({ value: propsVal = 'public', onChange }: Props) {
	const [value, setValue] = useState(propsVal);
	const privacyOption = getPrivacyOption(value);
	const icon = <Icon component={privacyOption.RIcon} rev />;

	useEffect(() => {
		setValue(propsVal);
	}, [propsVal]);

	const handleChange = (val: PrivacyType) => {
		if (val === value) return; // No change

		onChange?.(val);
		setValue(val);
	};

	return (
		<Dropdown
			menu={{
				onClick: ({ key }) => handleChange(key as PrivacyType),
				items: privacyOptions.map(({ value, label, RIcon }) => ({
					key: value,
					label: label,
					icon: <Icon component={RIcon} rev />,
				})),
			}}
			arrow
			trigger={['click']}
		>
			<Tooltip title={privacyOption.label}>
				<Button type="text" icon={icon} />
			</Tooltip>
		</Dropdown>
	);
}
