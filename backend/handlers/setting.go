package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	"backend/models"
)

// GetSettingsHandler retrieves the company settings for the authenticated company.
func GetSettingsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		companyIDVal, exists := c.Get("companyID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		companyID, ok := companyIDVal.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid company ID"})
			return
		}

		var company models.Companies
		if err := db.First(&company, companyID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Company not found"})
			return
		}
		c.JSON(http.StatusOK, company)
	}
}

// CompanyUpdateInput defines the payload for updating settings.
type CompanyUpdateInput struct {
	Name            string `json:"name" binding:"required"`
	Address         string `json:"address" binding:"required"`
	Phone           string `json:"phone" binding:"required"`
	Email           string `json:"email" binding:"required,email"`
	CurrentPassword string `json:"currentPassword" binding:"required"`
}

// UpdateSettingsHandler validates the current password and updates profile info.
func UpdateSettingsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		companyIDVal, exists := c.Get("companyID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		companyID, ok := companyIDVal.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid company ID"})
			return
		}

		var input CompanyUpdateInput
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Binding failed", "debug": err.Error()})
			return
		}

		var company models.Companies
		if err := db.First(&company, companyID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Company not found", "debug": err.Error()})
			return
		}

		// Validate current password.
		if err := bcrypt.CompareHashAndPassword([]byte(company.PasswordHash), []byte(input.CurrentPassword)); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid current password", "debug": "password comparison failed"})
			return
		}

		company.Name = input.Name
		company.Address = input.Address
		company.Phone = input.Phone
		company.Email = input.Email

		if err := db.Save(&company).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update settings", "debug": err.Error()})
			return
		}

		c.JSON(http.StatusOK, company)
	}
}

// CompanyChangePasswordInput defines the payload for changing the password.
type CompanyChangePasswordInput struct {
	CurrentPassword string `json:"currentPassword" binding:"required"`
	NewPassword     string `json:"newPassword" binding:"required,min=8"`
	ConfirmPassword string `json:"confirmPassword" binding:"required,eqfield=NewPassword"`
}

// ChangeCompanyPasswordHandler updates the company's password.
func ChangeCompanyPasswordHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		companyIDVal, exists := c.Get("companyID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}
		companyID, ok := companyIDVal.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid company ID"})
			return
		}

		var input CompanyChangePasswordInput
		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Binding failed", "debug": err.Error()})
			return
		}

		var company models.Companies
		if err := db.First(&company, companyID).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Company not found", "debug": err.Error()})
			return
		}

		// Validate current password.
		if err := bcrypt.CompareHashAndPassword([]byte(company.PasswordHash), []byte(input.CurrentPassword)); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid current password", "debug": "password mismatch"})
			return
		}

		// Hash the new password.
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash new password", "debug": err.Error()})
			return
		}

		company.PasswordHash = string(hashedPassword)
		if err := db.Save(&company).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password", "debug": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Password changed successfully"})
	}
}
