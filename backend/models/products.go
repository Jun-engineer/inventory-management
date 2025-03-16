package models

import (
	"gorm.io/gorm"
)

type Products struct {
	gorm.Model
	ProductName string    `gorm:"type:varchar(100); not null" json:"product_name"` // removed unique constraint
	Sku         string    `gorm:"type:varchar(50); unique" json:"sku"`
	Description string    `json:"description,omitempty"`
	SupplierID  uint      `gorm:"not null" json:"supplier_id"`
	Supplier    Companies `json:"supplier,omitempty"`
	Price       float64   `gorm:"type:decimal(10,2); not null" json:"price"`
	Status      string    `gorm:"type:varchar(50); default:'active'; not null" json:"status"`
}
