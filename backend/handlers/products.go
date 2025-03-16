package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"backend/models"
	"backend/utils"
)

// ProductResponse is the structure returned in the product list.
type ProductResponse struct {
	ID          uint    `json:"id"`
	ProductName string  `json:"product_name"`
	Sku         string  `json:"sku"`
	Price       float64 `json:"price"`
	Quantity    uint    `json:"quantity"`
	Description string  `json:"description"`
	Warehouse   string  `json:"warehouse"`
}

// GetProductsHandler retrieves the product list, joining inventory stock and warehouse data.
func GetProductsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var products []ProductResponse
		err := db.Table("products").
			Select("products.id, products.product_name, products.sku, products.price, inventory_stocks.quantity_in_stock as quantity, products.description, warehouses.warehouse_name as warehouse").
			Joins("LEFT JOIN inventory_stocks ON inventory_stocks.product_id = products.id").
			Joins("LEFT JOIN warehouses ON inventory_stocks.warehouse_id = warehouses.id").
			Scan(&products).Error

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
			return
		}
		c.JSON(http.StatusOK, products)
	}
}

// RegisterProductHandler handles product registration.
func RegisterProductHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Define the expected request payload.
		var req struct {
			ProductName string `json:"product_name"`
			// Remove sku from the request – it will be auto-generated.
			Description          string  `json:"description"`
			Price                float64 `json:"price"`
			Quantity             uint    `json:"quantity"`
			WarehouseID          uint    `json:"warehouse_id"`
			NewWarehouseName     string  `json:"new_warehouse_name"`
			NewWarehouseLocation string  `json:"new_warehouse_location"`
		}

		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
			return
		}

		// Basic product validation.
		if req.ProductName == "" || req.Price <= 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required product fields or invalid values"})
			return
		}

		// If warehouse_id is 0, then the user wants to add a new warehouse.
		var warehouseID uint = req.WarehouseID
		var warehouseRecord models.Warehouse
		if req.WarehouseID == 0 {
			if req.NewWarehouseName == "" {
				c.JSON(http.StatusBadRequest, gin.H{"error": "New warehouse name is required"})
				return
			}
			newWarehouse := models.Warehouse{
				WarehouseName: req.NewWarehouseName,
				Location:      req.NewWarehouseLocation,
			}
			if err := db.Create(&newWarehouse).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create new warehouse"})
				return
			}
			warehouseID = newWarehouse.ID
			warehouseRecord = newWarehouse
		} else {
			// Get the existing warehouse.
			if err := db.First(&warehouseRecord, req.WarehouseID).Error; err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid warehouse id"})
				return
			}
		}

		// Get the authenticated company ID from context.
		companyIDVal, exists := c.Get("companyID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Not authorized"})
			return
		}
		supplierID, ok := companyIDVal.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse company id"})
			return
		}

		// Count how many products already exist in this warehouse.
		var count int64
		db.Table("inventory_stocks").
			Where("warehouse_id = ?", warehouseID).
			Count(&count)
		productNumber := int(count) + 1

		// Generate SKU automatically using only warehouse info and product number.
		generatedSKU := utils.GenerateSKU(warehouseRecord.ID, warehouseRecord.WarehouseName, productNumber)

		// Create product record using supplierID from the authenticated company.
		product := models.Products{
			ProductName: req.ProductName,
			Sku:         generatedSKU,
			Description: req.Description,
			SupplierID:  supplierID,
			Price:       req.Price,
			Status:      "active",
		}
		if err := db.Create(&product).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
			return
		}

		// Create inventory stock record linked to the product.
		stock := models.InventoryStock{
			ProductID:       product.ID,
			WarehouseID:     warehouseID,
			QuantityInStock: req.Quantity,
		}
		if err := db.Create(&stock).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create inventory stock"})
			return
		}

		c.JSON(http.StatusCreated, gin.H{
			"message": "Product registered successfully",
			"product": product,
		})
	}
}

// GetProductHandler retrieves a single product (with inventory and warehouse info) by id.
func GetProductHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		idParam := c.Param("id")
		productID, err := strconv.Atoi(idParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product id"})
			return
		}

		var response struct {
			models.Products
			Quantity    uint   `json:"quantity"`
			Warehouse   string `json:"warehouse"`
			WarehouseID uint   `json:"warehouse_id"`
		}

		err = db.Table("products").
			Select("products.*, inventory_stocks.quantity_in_stock as quantity, warehouses.warehouse_name as warehouse, warehouses.id as warehouse_id").
			Joins("LEFT JOIN inventory_stocks ON inventory_stocks.product_id = products.id").
			Joins("LEFT JOIN warehouses ON inventory_stocks.warehouse_id = warehouses.id").
			Where("products.id = ?", productID).
			Scan(&response).Error

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch product"})
			return
		}
		c.JSON(http.StatusOK, response)
	}
}

// UpdateProductHandler updates product and its inventory info.
func UpdateProductHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get product id from URL parameter.
		idParam := c.Param("id")
		productID, err := strconv.Atoi(idParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product id"})
			return
		}

		// Define the expected request payload.
		// Note: we allow a warehouse_id but if it's 0, we won't update it.
		var req struct {
			ProductName string  `json:"product_name"`
			Sku         string  `json:"sku"`
			Description string  `json:"description"`
			Price       float64 `json:"price"`
			Quantity    uint    `json:"quantity"`
			WarehouseID uint    `json:"warehouse_id"`
		}

		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
			return
		}

		// Update the product record.
		var product models.Products
		if err := db.First(&product, productID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
			return
		}
		product.ProductName = req.ProductName
		product.Sku = req.Sku
		product.Description = req.Description
		product.Price = req.Price

		if err := db.Save(&product).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
			return
		}

		// Update the inventory stock record.
		var stock models.InventoryStock
		if err := db.Where("product_id = ?", product.ID).First(&stock).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Inventory record not found"})
			return
		}

		// Only update the quantity.
		stock.QuantityInStock = req.Quantity

		// If a valid warehouse id is provided (non-zero), update it.
		if req.WarehouseID > 0 {
			stock.WarehouseID = req.WarehouseID
		}
		// Otherwise, leave the warehouse_id unchanged.

		if err := db.Save(&stock).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update inventory record"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Product updated successfully"})
	}
}
