package utils

import (
	"fmt"
	"strings"
)

// GenerateSKU creates an SKU using the pattern:
// "W{warehouseCode}{warehouseID}-P{productNumber}"
// The warehouseCode is derived as the first two letters of warehouseName in upper case.
// warehouseID is formatted as a three-digit number.
// productNumber is formatted as a three-digit number.
func GenerateSKU(warehouseID uint, warehouseName string, productNumber int) string {
	// Use the first two letters of the warehouse name as code.
	warehouseCode := "XX"
	if len(warehouseName) >= 2 {
		warehouseCode = strings.ToUpper(warehouseName[:2])
	}
	// Format warehouseID as a three-digit number.
	formattedWarehouseID := fmt.Sprintf("%03d", warehouseID)
	return fmt.Sprintf("W%s%s-P%03d", warehouseCode, formattedWarehouseID, productNumber)
}
