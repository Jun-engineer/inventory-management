package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"backend/models"
)

// SendPermissionRequestHandler now expects a seller_email in the JSON body.
// The customer's email and phone are fetched from the Company record using the auth companyID.
func SendPermissionRequestHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the requester (customer) company id from Auth middleware.
		reqCompanyVal, exists := c.Get("companyID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		requesterID, ok := reqCompanyVal.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid requester ID"})
			return
		}

		// Parse the request body to get the seller's email.
		var reqBody struct {
			SellerEmail string `json:"seller_email"`
		}
		if err := c.BindJSON(&reqBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
			return
		}
		if reqBody.SellerEmail == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Seller email is required"})
			return
		}

		// Look up the seller by email.
		var seller models.Companies
		if err := db.Where("email = ?", reqBody.SellerEmail).First(&seller).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Seller with provided email not found"})
			return
		}

		// Look up the requester (customer) info from the Company table.
		var requester models.Companies
		if err := db.First(&requester, requesterID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch requester info"})
			return
		}

		// Create the permission request.
		permissionReq := models.PermissionRequest{
			SellerID:       seller.ID,
			RequesterID:    requester.ID,
			RequesterEmail: requester.Email,
			RequesterPhone: requester.Phone,
			Status:         "pending",
		}
		if err := db.Create(&permissionReq).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create permission request"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Permission request sent", "request": permissionReq})
	}
}

// GetPermissionRequestsHandler returns all permission requests for the seller (current company).
func GetPermissionRequestsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Current seller id from auth.
		sellerVal, exists := c.Get("companyID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		sellerID, ok := sellerVal.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid seller ID"})
			return
		}

		var requests []models.PermissionRequest
		if err := db.Where("seller_id = ?", sellerID).Find(&requests).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch requests"})
			return
		}

		// Optionally, you could join with the Company table to get the requester company name.
		c.JSON(http.StatusOK, requests)
	}
}

// SearchPermissionRequestsHandler lets the seller search requests by phone and email.
// Query parameters: email, phone
func SearchPermissionRequestsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		sellerVal, exists := c.Get("companyID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		sellerID, ok := sellerVal.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid seller ID"})
			return
		}

		email := c.Query("email")
		phone := c.Query("phone")

		var requests []models.PermissionRequest
		query := db.Where("seller_id = ?", sellerID)
		if email != "" {
			query = query.Where("requester_email = ?", email)
		}
		if phone != "" {
			query = query.Where("requester_phone = ?", phone)
		}

		if err := query.Find(&requests).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Search failed"})
			return
		}
		c.JSON(http.StatusOK, requests)
	}
}

// UpdatePermissionRequestHandler allows the seller to update a request status to "permitted" (or "rejected").
// URL parameter: requestId
// Expected JSON body: { "status": "permitted" }
func UpdatePermissionRequestHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get seller id from auth.
		sellerVal, exists := c.Get("companyID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		sellerID, ok := sellerVal.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid seller ID"})
			return
		}

		reqIdParam := c.Param("requestId")
		reqID, err := strconv.Atoi(reqIdParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request id"})
			return
		}

		var reqBody struct {
			Status string `json:"status"`
		}
		if err := c.BindJSON(&reqBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}
		if reqBody.Status != "permitted" && reqBody.Status != "rejected" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Status must be 'permitted' or 'rejected'"})
			return
		}

		// Ensure the request belongs to this seller.
		var permissionReq models.PermissionRequest
		if err := db.First(&permissionReq, reqID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Request not found"})
			return
		}
		if permissionReq.SellerID != sellerID {
			c.JSON(http.StatusForbidden, gin.H{"error": "Not allowed"})
			return
		}

		if err := db.Model(&permissionReq).Update("status", reqBody.Status).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update request"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Request updated", "request": permissionReq})
	}
}
