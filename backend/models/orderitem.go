package models

import (
	"gorm.io/gorm"
)

type OrderItem struct {
	gorm.Model
	OrderID   uint    `gorm:"not null" json:"order_id"`
	ProductID uint    `gorm:"not null" json:"product_id"`
	Quantity  uint    `gorm:"not null" json:"quantity"`
	Price     float64 `gorm:"not null" json:"price"` // price at time of order
}
