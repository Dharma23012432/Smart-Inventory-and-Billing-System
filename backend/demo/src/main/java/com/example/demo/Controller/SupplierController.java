package com.example.demo.Controller;

import com.example.demo.Models.Supplier;
import com.example.demo.Service.SupplierService;
import com.example.demo.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/supplier")
@RestController
public class SupplierController {
    @Autowired
    private SupplierService supplierService;

    @Autowired
    private SupplierRepository repository;

    @PostMapping("/create")
    public Supplier createSupplier(@RequestBody Supplier supplier){
        // Temporarily add this line for debugging:
        System.out.println("Attempting to create Supplier: " + supplier);

        // Now call the service
        return supplierService.addSupplier(supplier);
    }
    @GetMapping("/id/{id}")
    public Supplier getSupplierById(@PathVariable long id){
        return supplierService.getSupplierById(id);
    }

    @GetMapping("/view")
    public List<Supplier> getAllSuppliers(){
        return supplierService.getAllSupplier();
    }

    @PutMapping("/update/{id}")
    public Supplier updateSupplier(@PathVariable long id, @RequestBody Supplier updatedSupplier){
        Supplier existingSupplier = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier Not Found"));

        existingSupplier.setName(updatedSupplier.getName());
        existingSupplier.setEmail(updatedSupplier.getEmail());
        existingSupplier.setMobile(updatedSupplier.getMobile());
        existingSupplier.setCompany(updatedSupplier.getCompany());

        return repository.save(existingSupplier);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteSupplier(@PathVariable long id){
        supplierService.deleteSupplier(id);
        return "Supplier Deleted Successfully";
    }
    @DeleteMapping("/deleteAll")
    public String deleteAllProducts(){
        supplierService.deleteAll();
        return "All Suppliers Deleted Successfully";
    }
}



