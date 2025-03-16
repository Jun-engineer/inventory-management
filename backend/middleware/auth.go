package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

var secretKey []byte

func InitSecret() {
	secretKey = []byte(os.Getenv("JWT_SECRET"))
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the JWT token from cookie.
		cookie, err := c.Request.Cookie("next-auth.session-token")
		if err != nil || cookie.Value == "" {
			fmt.Println("Cookie retrieval error:", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token is required"})
			c.Abort()
			return
		}

		tokenString := cookie.Value

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Check the signing method.
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return secretKey, nil
		})

		if err != nil || !token.Valid {
			fmt.Println("Token parse error:", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// Retrieve user information from the token and store it into context.
		if claims, ok := token.Claims.(jwt.MapClaims); ok {

			// Store email from claims.
			if email, exists := claims["email"].(string); exists {
				c.Set("email", email)
			}
			// If the token includes a companyID claim, store it.
			if compID, exists := claims["companyID"]; exists {
				// JWT numbers are float64.
				if idFloat, ok := compID.(float64); ok {
					c.Set("companyID", uint(idFloat))
				} else if idStr, ok := compID.(string); ok {
					// Alternatively, if it's a string, convert.
					if id, err := strconv.Atoi(idStr); err == nil {
						c.Set("companyID", uint(id))
					}
				}
			}
		}

		c.Next()
	}
}
