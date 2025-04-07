package models

import (
	"time"

	"gorm.io/gorm"
)

type Warehouse struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `json:"deleted_at,omitempty"`
	WarehouseName string         `gorm:"type:varchar(100);not null" json:"warehouse_name"`
	Location      string         `gorm:"type:varchar(100)" json:"location"`
	CompanyID     uint           `json:"company_id"` // new field to track the owner
}
