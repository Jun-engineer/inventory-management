package models

import (
	"gorm.io/gorm"
)

type Companies struct {
	gorm.Model
	Name         string `gorm:"type:varchar(50);unique;not null" json:"name"`
	Address      string `gorm:"type:varchar(255);not null" json:"address"`
	Phone        string `gorm:"type:varchar(20);not null" json:"phone"`
	Email        string `gorm:"type:varchar(100);unique;not null" json:"email"`
	PasswordHash string `gorm:"type:varchar(255);not null" json:"-"`
	Status       string `gorm:"type:varchar(50);default:'active';not null" json:"status"`
}
