package com.autonova.backend.dto;

public class PaymentRequest {
    private long amount;

    public PaymentRequest() {
    }

    public PaymentRequest(long amount) {
        this.amount = amount;
    }

    public long getAmount() {
        return amount;
    }

    public void setAmount(long amount) {
        this.amount = amount;
    }
}