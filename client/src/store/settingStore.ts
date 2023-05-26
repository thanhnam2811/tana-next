import { ISetting } from '@interfaces';
import { create } from 'zustand';

export interface ISettingStore {
	setting: ISetting;
	getSetting: () => void;
	message: {
		toggleShowDetail: () => void;
	};
}

export const useSettingStore = create<ISettingStore>()((set) => ({
	setting: {
		message: {
			showDetail: false,
		},
	},
	getSetting: () => {
		const setting = localStorage.getItem('setting');
		if (setting) {
			set({ setting: JSON.parse(setting) });
		}
	},
	message: {
		toggleShowDetail: () => {
			set((state) => {
				const setting = {
					...state.setting,
					message: {
						...state.setting?.message,
						showDetail: !state.setting?.message.showDetail,
					},
				};
				localStorage.setItem('setting', JSON.stringify(setting));
				return { setting };
			});
		},
	},
}));
