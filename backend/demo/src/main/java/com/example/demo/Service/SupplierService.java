package com.example.demo.Service;

import com.example.demo.Models.Supplier;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {
    @Autowired
    private SupplierRepository repository;

    @Autowired
    private ProductRepository productRepository;

    public Supplier addSupplier(Supplier supplier){
        return repository.save(supplier); // Should be simple
    }
    public List<Supplier> getAllSupplier(){
        return repository.findAll();
    }

    public Supplier getSupplierById(Long id){
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier Not Found"));
    }

    public void deleteSupplier(Long id){
        repository.deleteById(id);
    }

    public String deleteAll() {
        productRepository.updateAllProductsSetSupplierNull();
        repository.deleteAll();
        return "All Suppliers Deleted Successfully";
    }
}

