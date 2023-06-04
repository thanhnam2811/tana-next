import { Button, Popover, PopoverProps, Space } from 'antd';
import {
	FacebookIcon,
	FacebookShareButton,
	LinkedinIcon,
	LinkedinShareButton,
	TelegramIcon,
	TelegramShareButton,
} from 'next-share';
import { useEffect, useState } from 'react';

interface Props {
	link: string;
	onShare?: () => void;
}

export function SharePopover({ link, onShare, ...props }: Props & PopoverProps) {
	const [url, setUrl] = useState<string>('');
	useEffect(() => {
		if (!link.startsWith('http')) {
			const hostname = window.location.hostname;
			const protocol = window.location.protocol;
			const port = window.location.port;

			const url = `${protocol}//${hostname}${port ? `:${port}` : ''}${link}`;
			setUrl(url);
		} else {
			setUrl(link);
		}
	}, []);

	return (
		<Popover
			content={
				<Space direction="vertical">
					<FacebookShareButton url={url}>
						<Button icon={<FacebookIcon size={24} round />} onClick={onShare}>
							Chia sẻ lên Facebook
						</Button>
					</FacebookShareButton>

					<LinkedinShareButton url={url}>
						<Button icon={<LinkedinIcon size={24} round />} onClick={onShare}>
							Chia sẻ lên Linkedin
						</Button>
					</LinkedinShareButton>

					<TelegramShareButton url={url}>
						<Button icon={<TelegramIcon size={24} round />} onClick={onShare}>
							Chia sẻ lên Telegram
						</Button>
					</TelegramShareButton>
				</Space>
			}
			trigger={['click']}
			{...props}
		/>
	);
}
