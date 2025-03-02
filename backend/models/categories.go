package models

import (
	"gorm.io/gorm"
)

type Categories struct {
	gorm.Model
	CategoryName string `gorm:"type:varchar(100); not null"`
	Description  string
}
