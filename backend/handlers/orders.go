package handlers

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"backend/models"
)

func CreateOrderHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Items []struct {
				ProductID uint `json:"product_id"`
				Quantity  uint `json:"quantity"`
			} `json:"items"`
		}

		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
			return
		}

		// Get the authenticated buyer's company ID from context.
		companyIDVal, exists := c.Get("companyID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		companyID, ok := companyIDVal.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid company id"})
			return
		}

		total := 0.0
		orderItems := []models.OrderItem{}

		// Loop through each item from the payload.
		for _, item := range req.Items {
			if item.ProductID == 0 {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product id"})
				return
			}

			var product models.Products
			if err := db.First(&product, item.ProductID).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Product not found"})
				return
			}

			// Check that the product's supplier is not the buyer's company.
			if product.SupplierID == companyID {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot order your own product"})
				return
			}

			subtotal := product.Price * float64(item.Quantity)
			total += subtotal

			orderItems = append(orderItems, models.OrderItem{
				ProductID: item.ProductID,
				Quantity:  item.Quantity,
				Price:     product.Price,
			})
		}

		order := models.Order{
			CompanyID:  companyID,
			Total:      total,
			Date:       time.Now(),
			OrderItems: orderItems,
			Status:     "Pending", // New orders start with "Pending" status
		}

		if err := db.Create(&order).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
			return
		}

		c.JSON(http.StatusCreated, order)
	}
}

// GetOrdersHandler retrieves all orders for the authenticated company.
// Here we assume that the authenticated company id has been set in the context (under "companyID").
func GetOrdersHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		companyIDVal, exists := c.Get("companyID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		companyID, ok := companyIDVal.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid company id"})
			return
		}

		var orders []models.Order
		// Preload OrderItems so that order details are included.
		if err := db.Preload("OrderItems").Where("company_id = ?", companyID).Find(&orders).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve orders"})
			return
		}
		c.JSON(http.StatusOK, orders)
	}
}

// PermitOrderHandler updates the order status to "Permitted".
// This endpoint is intended for sellers to approve an order.
func PermitOrderHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		idStr := c.Param("id")
		orderID, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order id"})
			return
		}

		var order models.Order
		if err := db.First(&order, orderID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
			return
		}

		// Ensure the order is in a status that can be permitted.
		if order.Status != "Pending" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Order is not pending approval"})
			return
		}

		order.Status = "Permitted"
		if err := db.Save(&order).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order status"})
			return
		}
		c.JSON(http.StatusOK, order)
	}
}
