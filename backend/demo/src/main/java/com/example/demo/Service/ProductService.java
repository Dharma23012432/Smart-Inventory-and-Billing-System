package com.example.demo.Service;

import com.example.demo.Models.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private MailService mailService;



    public void updateStock(long id, int soldQuantity) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product Not Found"));

        int newProduct = product.getStock() - soldQuantity;
        product.setStock(newProduct);
        productRepository.save(product);

        System.out.println("Updating stock for " + product.getName() + " | New Stock: " + newProduct);

        if (newProduct < product.getMinStock()) {
            System.out.println("Stock below minStock! Sending email to: " + product.getSupplier().getEmail());
            mailService.sendLowStockEmail(
                    product.getName(),
                    product.getSupplier().getEmail(),
                    newProduct
            );
        } else {
            System.out.println("Stock is sufficient. No mail sent.");
        }
    }

    public List<Product> getLowStock() {
        return productRepository.findAll()
                .stream()
                .filter(p -> p.getStock() < p.getMinStock())
                .collect(Collectors.toList());
    }

    public List<Product> getHealthyStock() {
        return productRepository.findAll()
                .stream()
                .filter(product -> product.getStock()>=product.getMinStock())
                .collect(Collectors.toList());
    }


//    public void updateStock(long id) {
//        Product existingProduct = productRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Product Not Found"));
//
//        existingProduct.setName(updateStock.getName());
//    }
}
