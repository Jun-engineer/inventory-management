package handlers

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "gorm.io/gorm"

    "backend/models"
)

// GetCostDataHandler aggregates cost management data for the authenticated company.
func GetCostDataHandler(db *gorm.DB) gin.HandlerFunc {
    return func(c *gin.Context) {
        // Get the current company ID from context.
        companyIDVal, exists := c.Get("companyID")
        if !exists {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
            return
        }
        companyID, ok := companyIDVal.(uint)
        if !ok {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid company ID"})
            return
        }

        var completedSpent float64
        var pendingSpent float64
        var completedEarned float64
        var pendingEarned float64

        // Query purchase orders (where the company is the buyer).
        // Completed orders: status "Completed"
        if err := db.Model(&models.Order{}).
            Where("company_id = ? AND status = ?", companyID, "Completed").
            Select("COALESCE(SUM(total),0)").Row().Scan(&completedSpent); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        // Pending orders: all orders that are not "Completed"
        if err := db.Model(&models.Order{}).
            Where("company_id = ? AND status != ?", companyID, "Completed").
            Select("COALESCE(SUM(total),0)").Row().Scan(&pendingSpent); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        // For sales orders, join order items with products.
        // Completed Earned: sum of (price * quantity) for items where product.SupplierID equals companyID.
        if err := db.Raw(`
            SELECT COALESCE(SUM(oi.price * oi.quantity), 0)
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id
            WHERE p.supplier_id = ? AND o.status = ?`, companyID, "Completed").
            Row().Scan(&completedEarned); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        // Pending Earned: for orders not completed.
        if err := db.Raw(`
            SELECT COALESCE(SUM(oi.price * oi.quantity), 0)
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id
            WHERE p.supplier_id = ? AND o.status != ?`, companyID, "Completed").
            Row().Scan(&pendingEarned); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }

        // Return the aggregated cost data as JSON.
        c.JSON(http.StatusOK, gin.H{
            "completedSpent":  completedSpent,
            "pendingSpent":    pendingSpent,
            "completedEarned": completedEarned,
            "pendingEarned":   pendingEarned,
        })
    }
}