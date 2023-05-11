import { createSlice } from '@reduxjs/toolkit';
import { UserType } from '../../utils/models/user.model';

interface UserState {
	[key: string]: any;
	data?: UserType;
}

const initialState: UserState = {
	data: undefined,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.data = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
