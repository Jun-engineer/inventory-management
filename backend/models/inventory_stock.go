package models

import (
	"gorm.io/gorm"
)

type InventoryStock struct {
	gorm.Model
	ProductID       uint      `gorm:"not null" json:"product_id"`
	Product         Products  `json:"product,omitempty"`
	WarehouseID     uint      `gorm:"not null" json:"warehouse_id"`
	Warehouse       Warehouse `json:"warehouse,omitempty"`
	QuantityInStock uint      `gorm:"default:0; not null" json:"quantity_in_stock"`
}
