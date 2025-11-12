package com.example.demo.Service; // Or your preferred package

import com.example.demo.Models.Product;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;

public class ProductSpecification {

    /**
     * Creates a specification for searching by product name.
     */
    public static Specification<Product> hasName(String search) {
        return (root, query, cb) ->
                cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%");
    }

    /**
     * Creates a specification for filtering by stock level ("low" or "healthy").
     */
    public static Specification<Product> hasStockLevel(String stockLevel) {
        return (root, query, cb) -> {
            if ("low".equals(stockLevel)) {
                // "low" means stock <= minStock
                return cb.lessThanOrEqualTo(root.get("stock"), root.get("minStock"));
            } else if ("healthy".equals(stockLevel)) {
                // "healthy" means stock > minStock
                return cb.greaterThan(root.get("stock"), root.get("minStock"));
            } else {
                return null; // No filter for "all"
            }
        };
    }
}