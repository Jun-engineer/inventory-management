package models

import (
	"time"
)

type Order struct {
	ID         uint        `gorm:"primaryKey" json:"id"`
	CompanyID  uint        `json:"company_id"`
	Total      float64     `json:"total"`
	Status     string      `json:"status"`
	Date       time.Time   `json:"date"`
	OrderItems []OrderItem `json:"OrderItems"`
}
