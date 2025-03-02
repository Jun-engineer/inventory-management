package models

import (
	"gorm.io/gorm"
)

type Users struct {
	gorm.Model
	UserName     string `gorm:"type:varchar(50);unique;not null"`
	Email        string `gorm:"type:varchar(100);unique;not null"`
	PasswordHash string `gorm:"type:varchar(255);not null"`
	Role         string `gorm:"type:varchar(50);default:'user';not null"`
	Status       string `gorm:"type:varchar(50);default:'active';not null"`
}
