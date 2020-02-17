const generateResetPasaswordEmail = (email, token) => ({
	to: email,
	from: 'ign0ramus.github.io@shoppy.com',
	subject: 'Password reset',
	html: `
		<h1>You requested password reset</h1>
		<p>Click this <a href="${process.env.HOST}/reset/${token}">link</a> to reset password</p>
		<p>This link  valid only for one hour</p>
		`,
});

module.exports = {
	generateResetPasaswordEmail,
};
