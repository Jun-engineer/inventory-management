package models

import (
	"gorm.io/gorm"
)

type InventoryStock struct {
	gorm.Model
	ProductID       uint `gorm:"not null"`
	Product         Products
	WarehouseID     uint `gorm:"not null"`
	Warehouse       Warehouse
	QuantityInStock uint `gorm:"default:0; not null"`
	ReorderLevel    uint `gorm:"default:0; not null"`
}
