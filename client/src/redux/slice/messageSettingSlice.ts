import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MessageSettingState {
	[key: string]: any;

	showDetail: boolean;
}

const initialState: MessageSettingState = {
	showDetail: false,
};

export const messageSettingSlice = createSlice({
	name: 'messageSetting',
	initialState,
	reducers: {
		setShowDetail: (state, action: PayloadAction<boolean>) => {
			state.showDetail = action.payload;
		},
		toggleShowDetail: (state) => {
			state.showDetail = !state.showDetail;
		},
	},
});

export const { setShowDetail, toggleShowDetail } = messageSettingSlice.actions;

export default messageSettingSlice.reducer;
