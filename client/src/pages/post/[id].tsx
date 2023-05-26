import { IPost } from '@interfaces';
import { postApi } from '@utils/api';
import { GetServerSideProps } from 'next';
import React from 'react';

interface Props {
	post: IPost;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
	try {
		const { data: post } = await postApi.serverGet(params?.id as string);

		console.log({ post });

		return { props: { post } };
	} catch (error) {
		console.log(error);
		return { notFound: true };
	}
};

export default function Post({ post }: Props) {
	return <div>{JSON.stringify(post, null, 2)}</div>;
}
