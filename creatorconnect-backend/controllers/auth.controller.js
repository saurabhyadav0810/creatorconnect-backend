import {
	initiateSignupService,
	verifySignupOtpService,
	loginService
} from "../services/auth.service.js";


export const initiateSignup = async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({
				success: false,
				message: "Email is required"
			});
		}

		const result = await initiateSignupService(email);

		res.status(200).json({
			success: true,
			message: "OTP sent successfully",
			...result
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
};

export const verifySignupOtp = async (req, res) => {
	try {
		const { email, otp, name, password, role } = req.body;

		if (!email || !otp) {
			return res.status(400).json({
				success: false,
				message: "Email and OTP are required"
			});
		}

		const result = await verifySignupOtpService({
			email,
			otp,
			name,
			password,
			role
		});

		res.cookie("token", result.token, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			maxAge: 60 * 60 * 1000
		});

		res.status(201).json({
			success: true,
			message: "OTP verified successfully",
			user: result.user
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message
		});
	}
};


export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		const result = await loginService(email, password);

		res.cookie("token", result.token, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			maxAge: 60 * 60 * 1000
		});

		res.status(200).json({
			success: true,
			message: "Login successful",
			user: result.user
		});
	} catch (error) {
		res.status(401).json({
			success: false,
			message: error.message
		});
	}
};


