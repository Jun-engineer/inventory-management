package models

import (
	"gorm.io/gorm"
)

type Warehouse struct {
	gorm.Model
	WarehouseName string `gorm:"type:varchar(100);not null"`
	Location      string `gorm:"type:varchar(100)"`
}
