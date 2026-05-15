package com.demo.dto;

import com.demo.model.BillItem;

public class BillItemDTO {
    public String description;
    public Double amount;

    public BillItemDTO(BillItem item) {
        this.description = item.getItemName();
        this.amount      = item.getTotalPrice();
    }
}