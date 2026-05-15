package com.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.demo.model.Bill;

public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByPatientId(Long patientId);
    List<Bill> findByPaymentStatus(Bill.PaymentStatus status);

    @Query("SELECT SUM(b.totalAmount) FROM Bill b WHERE b.paymentStatus = 'PAID'")
    Double getTotalRevenue();
    boolean existsByAppointmentId(Long appointmentId);
}