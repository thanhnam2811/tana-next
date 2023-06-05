import React from 'react';

export const lazyImport = (path: string) => {
	return React.lazy(() => import(`@${path}`));
};
