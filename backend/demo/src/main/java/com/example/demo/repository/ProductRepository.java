package com.example.demo.repository;

import com.example.demo.Models.Product;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findByNameContainingIgnoreCase(String name);


    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.supplier = NULL WHERE p.supplier.id = :supplierId")
    void unlinkProductsFromSupplier(@Param("supplierId") Long supplierId);

    //unlink all suppliers(used for deleteAll)
    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.supplier = NULL")
    void updateAllProductsSetSupplierNull();
}
