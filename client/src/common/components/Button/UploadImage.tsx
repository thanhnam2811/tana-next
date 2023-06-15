import React from 'react';
import ImgCrop, { ImgCropProps } from 'antd-img-crop';
import { Upload, UploadProps } from 'antd';

interface Props {
	cropProps: Omit<ImgCropProps, 'children'>;
	onPickImage: (file: File) => void | Promise<void>;
}

export function UploadImage({ cropProps, onPickImage, ...props }: Props & UploadProps) {
	return (
		<ImgCrop {...cropProps}>
			<Upload
				fileList={[]}
				beforeUpload={(file) => {
					onPickImage(file);
					return false;
				}}
				{...props}
			/>
		</ImgCrop>
	);
}
