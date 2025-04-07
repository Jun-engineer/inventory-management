package models

import "gorm.io/gorm"

// PermissionRequest represents a request from a customer (requester)
// to gain access to a seller's products.
type PermissionRequest struct {
	gorm.Model
	SellerID       uint   `json:"seller_id"`    // the targeted seller company id
	RequesterID    uint   `json:"requester_id"` // the sending (customer) company id
	RequesterEmail string `json:"requester_email"`
	RequesterPhone string `json:"requester_phone"`
	Status         string `json:"status"` // "pending", "permitted", "rejected"
}
