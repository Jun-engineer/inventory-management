package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"backend/models"
)

// GetSalesHandler retrieves orders where at least one order item belongs to products supplied by the authenticated seller.
func GetSalesHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the authenticated seller's company ID from context.
		sellerIDVal, exists := c.Get("companyID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		sellerID, ok := sellerIDVal.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid seller id"})
			return
		}

		var orders []models.Order
		// Join orders with order_items and products.
		// Only include orders where products.supplier_id equals the seller's company ID.
		err := db.Preload("OrderItems").
			Joins("JOIN order_items ON order_items.order_id = orders.id").
			Joins("JOIN products ON products.id = order_items.product_id").
			Where("products.supplier_id = ?", sellerID).
			Group("orders.id").
			Find(&orders).Error
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch sales orders"})
			return
		}

		c.JSON(http.StatusOK, orders)
	}
}
