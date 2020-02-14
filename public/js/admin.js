const handleDeleteProduct = async btn => {
	try {
		const id = btn.parentNode.querySelector('[name=id]').value;
		const token = btn.parentNode.querySelector('[name=_csrf]').value;

		const res = await fetch(`/admin/product/${id}`, {
			method: 'DELETE',
			headers: {
				'csrf-token': token,
			},
		});

		await res.json();
		const product = btn.closest('article');
		product.parentNode.removeChild(product);
    } catch (err) {
        console.error(err);
		alert('Deleting product failed!');
	}
};
