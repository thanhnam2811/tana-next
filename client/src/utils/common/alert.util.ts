import { toast } from 'react-hot-toast';
import Swal, { SweetAlertIcon } from 'sweetalert2';

export const showLoadingAlert = (title = 'Vui lòng chờ!', text = '', icon: SweetAlertIcon = 'info') =>
	Swal.fire({
		title: title,
		text: text,
		icon: icon,
		allowEscapeKey: false,
		allowOutsideClick: false,
		didOpen: () => {
			Swal.showLoading();
		},
	});

export const showIncomingAlert = () => toast('Chức năng đang được phát triển!', { icon: '🚧' });
