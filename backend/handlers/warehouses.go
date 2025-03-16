package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"backend/models"
)

// GetWarehousesHandler returns all warehouses from the database.
func GetWarehousesHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var warehouses []models.Warehouse
		if err := db.Find(&warehouses).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch warehouses"})
			return
		}
		c.JSON(http.StatusOK, warehouses)
	}
}
