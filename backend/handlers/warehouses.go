package handlers

import (
	"net/http"
	"strconv"

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

// GetWarehouseHandler retrieves a single warehouse by id.
func GetWarehouseHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		idParam := c.Param("id")
		warehouseID, err := strconv.Atoi(idParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid warehouse id"})
			return
		}
		var warehouse models.Warehouse
		if err := db.First(&warehouse, warehouseID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Warehouse not found"})
			return
		}
		c.JSON(http.StatusOK, warehouse)
	}
}

// UpdateWarehouseHandler updates the warehouse's name and location.
func UpdateWarehouseHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Parse warehouse id from URL parameter.
		idParam := c.Param("id")
		warehouseID, err := strconv.Atoi(idParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid warehouse id"})
			return
		}

		// Define expected payload.
		var req struct {
			WarehouseName string `json:"warehouse_name"`
			Location      string `json:"location"`
		}
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
			return
		}

		// Fetch the warehouse record.
		var wh models.Warehouse
		if err := db.First(&wh, warehouseID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Warehouse not found"})
			return
		}

		// Update the warehouse fields.
		wh.WarehouseName = req.WarehouseName
		wh.Location = req.Location

		if err := db.Save(&wh).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update warehouse"})
			return
		}

		c.JSON(http.StatusOK, wh)
	}
}

// AddWarehouseHandler creates a new warehouse.
func AddWarehouseHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			WarehouseName string `json:"warehouse_name"`
			Location      string `json:"location"`
		}
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
			return
		}

		newWarehouse := models.Warehouse{
			WarehouseName: req.WarehouseName,
			Location:      req.Location,
		}
		if err := db.Create(&newWarehouse).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create warehouse"})
			return
		}
		c.JSON(http.StatusCreated, newWarehouse)
	}
}

func DeleteWarehouseHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		idParam := c.Param("id")
		warehouseID, err := strconv.Atoi(idParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid warehouse id"})
			return
		}

		// Check if the warehouse is referenced by any non-deleted inventory stocks.
		var count int64
		db.Model(&models.InventoryStock{}).
			Where("warehouse_id = ? AND deleted_at IS NULL", warehouseID).
			Count(&count)
		if count > 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Cannot delete warehouse: it is referenced by inventory stocks"})
			return
		}

		// Perform soft-delete.
		if err := db.Delete(&models.Warehouse{}, warehouseID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete warehouse"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Warehouse deleted successfully"})
	}
}
