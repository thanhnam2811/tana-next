import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Button, ButtonProps } from 'antd';
import { Duration } from 'dayjs/plugin/duration';
import { dateUtil } from '@common/utils';

interface Props extends ButtonProps {
	milliseconds: number;
	step?: number;
	renderCountdown?: (duration: Duration) => ReactNode;
	afterChildren?: ReactNode;
	state?: 'start' | 'stop';
}

export function CountdownButton({
	milliseconds,
	step = 1000,
	renderCountdown,
	afterChildren,
	state: initState = 'stop',
	...props
}: Props) {
	const [state, setState] = useState<'start' | 'stop'>(initState);
	const [countdown, setCountdown] = useState(milliseconds);
	const duration = dateUtil.getDuration(countdown);

	const countdownRef = useRef<NodeJS.Timer>();
	useEffect(() => {
		const isStart = state === 'start';
		if (isStart) {
			countdownRef.current = setInterval(() => {
				setCountdown((prev) => {
					const next = prev - step;
					if (next <= 0) {
						clearInterval(countdownRef.current);
						setState('stop');
						return milliseconds;
					} else return next;
				});
			}, step);
		} else if (countdownRef.current) clearInterval(countdownRef.current);

		return () => {
			if (countdownRef.current) clearInterval(countdownRef.current);
		};
	}, [state]);

	const startCountdown = () => setState('start');

	const isCounting = state === 'start';

	// default renderCountdown
	renderCountdown ??= (duration: Duration) => {
		const { minutes, seconds } = {
			minutes: duration.minutes(),
			seconds: duration.seconds(),
		};
		const arr = [minutes, seconds].map((n) => n.toString().padStart(2, '0'));
		return arr.join(':');
	};

	// default afterChildren
	afterChildren ??= props.children;

	return (
		<Button
			{...props}
			loading={isCounting || props.loading}
			onClick={async (e: any) => {
				await props?.onClick?.(e);
				if (!props.disabled) startCountdown();
			}}
		>
			{isCounting ? renderCountdown(duration) : countdownRef.current ? afterChildren : props.children}
		</Button>
	);
}
