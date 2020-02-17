const fs = require('fs');

const deleteFile = filePath => {
	return new Promise((res, rej) => {
		fs.unlink(filePath.slice(1, filePath.length), err => {
			if (err) {
				return rej(err);
			}
			res();
		});
	});
};

module.exports = { deleteFile };
