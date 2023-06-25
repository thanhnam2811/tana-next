const nodemailer = require('nodemailer');
const emailValidator = require('deep-email-validator');

const emailTemplateVerify = (link, name) => `
    <div style="background-color: #f5f5f5; padding: 20px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://www.tana.social/logo.png" alt="logo" style="width: 100px; height: 100px;">
            </div>
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #333; font-size: 24px; margin-bottom: 10px;">Xin chào ${name}</h1>
                <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Cảm ơn bạn đã đăng ký tài khoản của TaNa social netwrok.</p>
                <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Vui lòng nhấn vào nút bên dưới để xác nhận tài khoản của bạn.</p>
            </div>
            <div style="text-align: center; margin-bottom: 20px;">
                <a href="${link}" style="background-color: #2e6da4; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Xác nhận tài khoản</a>
            </div>
            <div style="text-align: center; margin-bottom: 20px;">
                <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Trân trọng,</p>
                <p style="color: #333; font-size: 16px; margin-bottom: 10px;">&nbsp;TaNa social netwrok</p>
            </div>
        </div>
    </div>
    `;
const emailTemplateSendOTP = (otp, name) =>
	`
    <div style="background-color: #f5f5f5; padding: 20px 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://www.tana.social/logo.png" alt="logo" style="width: 100px; height: 100px;">
            </div>
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #333; font-size: 24px; margin-bottom: 10px;">Xin chào ${name}</h1>
                <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Cảm ơn bạn đã đăng ký tài khoản của TaNa social netwrok.</p>
                <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Đây là mã OTP của bạn.</p>
            </div>
            <div style="text-align: center; margin-bottom: 20px;">
                <h4 style="background-color: #2e6da4; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">${otp}</h4>
            </div>
            <div style="text-align: center; margin-bottom: 20px;">
                <p style="color: #333; font-size: 16px; margin-bottom: 10px;">Trân trọng,</p>
                <p style="color: #333; font-size: 16px; margin-bottom: 10px;">&nbsp;TaNa social netwrok</p>
            </div>
        </div>
    </div>
    `;
const emailTemplate = (link, name) => `<body
    marginheight="0"
    topmargin="0"
    marginwidth="0"
    style="margin: 0px"
    leftmargin="0"
>
    <style>
        @import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,600,700);
    </style>
    <!--100% body table-->
    <table
        cellspacing="0"
        border="0"
        cellpadding="0"
        width="100%"
        style="font-family: 'Open Sans', sans-serif"
    >
        <tr>
            <td>
                <table
                    style="max-width: 600px; margin: 0 auto"
                    width="100%"
                    border="0"
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                >
                    <tr>
                        <td style="height: 6em">&nbsp;</td>
                    </tr>
                    <tr>
                        <td>
                            <div
                                style="
                                    margin: 8px;
                                    padding: 4px;
                                    border-radius: 16px;
                                    background: linear-gradient(
                                        45deg,
                                        #fa8bff 0%,
                                        #2bd2ff 52%,
                                        #2bff88 90%
                                    );
                                "
                            >
                                <table
                                    border="0"
                                    align="center"
                                    cellpadding="0"
                                    cellspacing="0"
                                    style="
                                        max-width: 600px;
                                        background: #fff;
                                        border-radius: 3px;
                                        text-align: center;
                                        border-radius: 16px;
                                        -webkit-box-shadow: 0px 5px 15px 0px
                                            rgba(0, 0, 0, 0.3);
                                        -moz-box-shadow: 0px 5px 15px 0px
                                            rgba(0, 0, 0, 0.3);
                                        box-shadow: 0px 5px 15px 0px
                                            rgba(0, 0, 0, 0.3);
                                    "
                                >
                                    <tr>
                                        <td style="height: 40px">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 0 2em">
                                            <h1
                                                style="
                                                    color: #1e1e2d;
                                                    margin: 0;
                                                    font-size: 32px;
                                                "
                                            >
                                                Yêu cầu đặt lại mật khẩu!
                                            </h1>
                                            <span
                                                style="
                                                    display: inline-block;
                                                    vertical-align: middle;
                                                    margin: 1em 0;
                                                    border-bottom: 1px solid
                                                        #cecece;
                                                    width: 100px;
                                                "
                                            ></span>
                                            <p
                                                style="
                                                    color: #455056;
                                                    font-size: 16px;
                                                    line-height: 24px;
                                                    margin: 0;
                                                "
                                            >
                                                Chào <b>${name}</b>, chúng tôi
                                                vừa nhận được yêu cầu đặt lại
                                                mật khẩu cho tài khoản của bạn.
                                                Yêu cầu có hiệu lực trong vòng
                                                <b>5 phút</b>, nhấp vào nút bên
                                                dưới để đặt lại mật khẩu.
                                            </p>
                                            <a
                                                href="${link}"
                                                style="
                                                    background: #1877f2;
                                                    text-decoration: none !important;
                                                    font-weight: 500;
                                                    margin: 1em 0;
                                                    color: #fff;
                                                    text-transform: uppercase;
                                                    font-size: 14px;
                                                    padding: 1em 2em;
                                                    display: inline-block;
                                                    border-radius: 2em;
                                                "
                                            >
                                                Đặt lại mật khẩu
                                            </a>
                                            <p
                                                style="
                                                    color: red;
                                                    font-size: 16px;
                                                    line-height: 24px;
                                                "
                                            >
                                                <b>
                                                    Nếu bạn không yêu cầu đặt
                                                    lại mật khẩu, vui lòng bỏ
                                                    qua email này.
                                                </b>
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height: 40px">&nbsp;</td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="height: 2em">&nbsp;</td>
                    </tr>
                    <tr>
                        <td style="text-align: center">
                            <a
                                href="https://tana.social"
                                style="
                                    font-size: 14px;
                                    color: rgba(69, 80, 86, 0.7411764705882353);
                                    line-height: 18px;
                                    margin: 0 0 0;
                                    text-decoration: none;
                                "
                            >
                                &copy; <strong>tana.social</strong>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="height: 4em">&nbsp;</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    <!--/100% body table-->
</body>`;

const sendEmail = async (email, subject, link, user) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: 587,
			secure: true,
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});

		await transporter.sendMail({
			from: process.env.FROM,
			to: email,
			subject,
			text: link,
			html: emailTemplate(link, user.fullname),
		});
		// return true if email sent successfully
		console.log('email sent sucessfully');
		return true;
	} catch (error) {
		// return false if email sent failed
		console.log(error, 'email not sent');
		return false;
	}
};

const isEmailValid = (email) => emailValidator.validate(email);

// send mail to user verify email address and activated account
const sendEmailVerify = async (email, subject, link, user) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: 587,
			secure: true,
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});

		await transporter.sendMail({
			from: process.env.FROM,
			to: email,
			subject,
			text: link,
			html: emailTemplateVerify(link, user.fullname),
		});
		// return true if email sent successfully
		console.log('email sent sucessfully');
		return true;
	} catch (error) {
		// return false if email sent failed
		console.log(error, 'email not sent');
		return false;
	}
};

const sendMailOTP = async (email, subject, otp, name) => {
	try {
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: 587,
			secure: true,
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});

		await transporter.sendMail({
			from: process.env.FROM,
			to: email,
			subject,
			text: otp,
			html: emailTemplateSendOTP(otp, name),
		});
		// return true if email sent successfully
		console.log('email sent sucessfully');
		return true;
	} catch (error) {
		// return false if email sent failed
		console.log(error, 'email not sent');
		return false;
	}
};

module.exports = {
	sendEmail,
	sendEmailVerify,
	isEmailValid,
	sendMailOTP,
};
