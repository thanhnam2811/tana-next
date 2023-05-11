export const getUniqueArray = (
	arr: Array<any>,
	// eslint-disable-next-line no-unused-vars
	isEqual: (item1: any, item2: any) => boolean = (item1, item2) => item1 === item2
) => arr.filter((item, index, initArray) => initArray.findIndex((i) => isEqual(i, item)) === index);
