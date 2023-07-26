const form = document.getElementById('productForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent form submission

      // Validate inputs
      const productName = document.querySelector('.product_name').value.trim();
      const productPrice = parseFloat(document.querySelector('.product_price').value.trim());
      const productImage = document.querySelector('.product_image').value.trim();
      const productDescription = document.querySelector('.product_description').value.trim();
      const productCategory = document.querySelector('.product_category').value.trim();
      const productQuantity = parseInt(document.querySelector('.product_quantity').value.trim());

      if (!productName || isNaN(productPrice) || !productImage || !productDescription || !productCategory || isNaN(productQuantity)) {
        alert('Please fill all the fields and ensure the price and quantity are valid numbers.');
        return;
      }

      const data = {
        product_name: productName,
        product_price: productPrice,
        product_image: productImage,
        product_description: productDescription,
        product_category: productCategory,
        product_quantity: productQuantity
      };

      fetch('/product/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        if(data){
            window.location.href = '/product/create';
        }
       
        console.log(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });