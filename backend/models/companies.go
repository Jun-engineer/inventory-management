package models

import (
	"gorm.io/gorm"
)

type Companies struct {
	gorm.Model
	Name         string `gorm:"type:varchar(50);unique;not null"`
	Address      string `gorm:"type:varchar(255);not null"`
	Phone        string `gorm:"type:varchar(20);not null"`
	Email        string `gorm:"type:varchar(100);unique;not null"`
	PasswordHash string `gorm:"type:varchar(255);not null"`
	Status       string `gorm:"type:varchar(50);default:'active';not null"`
}
