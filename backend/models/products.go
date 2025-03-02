package models

import (
	"gorm.io/gorm"
)

type Products struct {
	gorm.Model
	ProductName string `gorm:"type: varchar(100); not null"`
	Sku         string `gorm:"type: varchar(50); unique"`
	Description string
	CategoryID  uint
	Category    Categories
	SupplierID  uint
	Supplier    Suppliers
	Status      string `gorm:"type: enum('active', 'discontinued'); default: 'active'; not null"`
}
