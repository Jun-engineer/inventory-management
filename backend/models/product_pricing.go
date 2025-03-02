package models

import (
	"time"

	"gorm.io/gorm"
)

type ProductPricing struct {
	gorm.Model
	ProductID     uint `gorm:"not null"`
	Product       Products
	Cost          float64   `gorm:"type:numeric(10,2); not null"`
	Price         float64   `gorm:"type:numeric(10,2); not null"`
	EffectiveDate time.Time `gorm:"default:CURRENT_TIMESTAMP"`
}
