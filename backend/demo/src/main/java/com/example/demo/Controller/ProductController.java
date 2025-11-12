package com.example.demo.Controller;

import com.example.demo.Models.Product;
import com.example.demo.Models.Supplier;
import com.example.demo.Service.ProductService;
import com.example.demo.Service.ProductSpecification;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository repo;

    @Autowired
    private SupplierRepository supplierRepository;

    //adding products
    @PostMapping("/add")
    public Product addProducts(@RequestBody Product product){

        if (product.getSupplier().getId() != 0) {
            Supplier supplier = supplierRepository.findById(product.getSupplier().getId())
                    .orElseThrow(() -> new RuntimeException("Supplier Not Found"));
            product.setSupplier(supplier);
        }else{
            throw new RuntimeException("Supplier Information is missing");
        }
        return repo.save(product);
    }

    //viewing products
    @GetMapping("/view")
    public List<Product> viewProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String stockLevel,
            @RequestParam(required = false) String size,

            // 1. These parameters are correctly accepted
            @RequestParam(defaultValue = "stock") String sortField,
            @RequestParam(defaultValue = "asc") String sortDirection
    ) {
        // Start with an empty specification (finds all)
        Specification<Product> spec = Specification.where(null);

        // If 'search' param is present, add the name filter
        if (search != null && !search.isEmpty()) {
            spec = spec.and(ProductSpecification.hasName(search));
        }

        // If 'stockLevel' param is present (and not "all"), add the stock filter
        if (stockLevel != null && !stockLevel.equals("all")) {
            spec = spec.and(ProductSpecification.hasStockLevel(stockLevel));
        }

        // 2. ADD SIZE FILTER LOGIC HERE (e.g., if you implement hasSize in ProductSpecification)
        // Assuming you create a static method ProductSpecification.hasSize(size)
        // spec = spec.and(ProductSpecification.hasSize(size));

        // --- 3. APPLY SORTING LOGIC ---

        // a. Determine the sort direction from the request parameter
        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        // b. Create the Sort object using the direction and field (e.g., 'stock')
        Sort sort = Sort.by(direction, sortField);

        // c. Return the result of the combined query, applying BOTH the spec (filter) and sort
        return repo.findAll(spec, sort);
    }
    //  view healthy stocks
    @GetMapping("/healthy-stock")
    public List<Product> getHealthyStock(){
        return productService.getHealthyStock();
    }

    //updating products
    @PutMapping("/update/{id}")
    public Product updateStock(@PathVariable long id,@RequestBody Product updatedProduct){
        Product existingProduct = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product Not Found"));

        existingProduct.setName(updatedProduct.getName());
        existingProduct.setStock(updatedProduct.getStock());
        existingProduct.setMinStock(updatedProduct.getMinStock());
        existingProduct.setSupplier(updatedProduct.getSupplier());

        return repo.save(existingProduct);
    }
// ProductController.java

    @GetMapping("/{id}") // The endpoint is just the path variable {id}
    public Product getProductById(@PathVariable long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product Not Found for ID: " + id));
    }
    //selling and updating products
    @PutMapping("/{id}/sell/{soldQuantity}")
    public String updateAndSellProducts(@PathVariable long id,@PathVariable int soldQuantity){
        productService.updateStock(id,soldQuantity);
        return "Product Sold and Stock Updated";
    }

    //deleting products
    @DeleteMapping("/delete/{id}")
    public String deleteProducts(@PathVariable long id){
        if(!repo.existsById(id)){
            throw new RuntimeException("Product Not Found");
        }
        repo.deleteById(id);
        return "Product Deleted Successfully";
    }
    //delete all
    @DeleteMapping("/deleteAll")
    public String deleteAllProducts(){
        repo.deleteAll();
        return "All Products Deleted Successfully";
    }

    //search by name
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String name){
        return repo.findByNameContainingIgnoreCase(name);
    }


    //sort by name
    @GetMapping("/sorted")
    public List<Product> sortedProducts(@RequestParam(defaultValue = "stock") String sortBy) {
        return repo.findAll(org.springframework.data.domain.Sort.by(sortBy));
    }
    //products restock
    @PutMapping("/restock/{id}/{quantity}")
    public String restockProducts(@PathVariable long id,@PathVariable int quantity){
        Product restock = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product Not Found"));

        restock.setStock(restock.getStock() + quantity);
        repo.save(restock);
        return "Product Updated Successfully";
    }
    @GetMapping("/low-stock")
    public List<Product> getAllLowStockProducts(){
        return productService.getLowStock();
    }

}
