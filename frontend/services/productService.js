app.service("ProductService", function ($http) {

  this.addProduct = function (product) {

    const fd = new FormData();

    fd.append("title", product.title);
    fd.append("price", product.price);
    fd.append("description", product.description);
    fd.append("category", product.category);
    fd.append("seller", product.seller);
    
    // Append multiple images
    if (product.image1) fd.append("images", product.image1);
    if (product.image2) fd.append("images", product.image2);
    if (product.image3) fd.append("images", product.image3);

    return $http.post("http://localhost:5000/api/products", fd, {
      headers: { "Content-Type": undefined }
    });

  };


  this.getProducts = function () {
    return $http.get("http://localhost:5000/api/products");
  };

  this.deleteProduct = function (id) {
    return $http.delete("http://localhost:5000/api/products/" + id);
  };

  // Get single product
  this.getProduct = function (id) {
    return $http.get("http://localhost:5000/api/products/" + id);
  };

  // Update product
  this.updateProduct = function (id, product) {
    const fd = new FormData();
    fd.append("title", product.title);
    fd.append("price", product.price);
    fd.append("description", product.description);
    fd.append("category", product.category);
    fd.append("seller", product.seller);

    // Append new images if provided
    if (product.image1 && typeof product.image1 === 'object') fd.append("images", product.image1);
    if (product.image2 && typeof product.image2 === 'object') fd.append("images", product.image2);
    if (product.image3 && typeof product.image3 === 'object') fd.append("images", product.image3);

    return $http.put("http://localhost:5000/api/products/" + id, fd, {
      headers: { "Content-Type": undefined }
    });
  };



  this.buyProduct = function (id) {
    return $http.put(
      "http://localhost:5000/api/products/buy/" + id,
      { status: "sold" }
    );
  }




})

