import { App, Form } from 'antd';
import { ReportFormType, ReportVariant } from '../types';
import { ReportForm } from '../components';

interface Props {
	type: ReportVariant;
}

export function useReport({ type }: Props) {
	const { modal } = App.useApp();
	const [form] = Form.useForm<ReportFormType>();

	const openReport = () =>
		modal.warning({
			title: 'Báo cáo',
			content: <ReportForm form={form} />,
			onOk: () => form.submit(),
		});

	return { openReport };
}
