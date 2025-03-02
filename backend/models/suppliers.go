package models

import (
	"gorm.io/gorm"
)

type Suppliers struct {
	gorm.Model
	SupplierName string `gorm:"type:varchar(100);not null"`
	ContactName  string `gorm:"type:varchar(100)"`
	Phone        string `gorm:"type:varchar(20)"`
	Email        string `gorm:"type:varchar(100)"`
	Address      string
}
