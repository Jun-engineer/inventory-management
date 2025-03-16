package routes

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"backend/handlers"
	"backend/middleware"
)

// SetupRoutes configures the Gin engine with all routes and middleware.
func SetupRoutes(db *gorm.DB) *gin.Engine {
	r := gin.Default()

	// Load trusted proxies from environment variable TRUSTED_PROXIES.
	// The variable should be a comma-separated list, e.g. "127.0.0.1,192.168.0.1".
	proxiesEnv := os.Getenv("TRUSTED_PROXIES")
	var proxies []string
	if proxiesEnv == "" {
		proxies = []string{"127.0.0.1"}
	} else {
		// Trim spaces for each proxy.
		for _, proxy := range strings.Split(proxiesEnv, ",") {
			proxies = append(proxies, strings.TrimSpace(proxy))
		}
	}
	if err := r.SetTrustedProxies(proxies); err != nil {
		log.Println("Error setting trusted proxies:", err)
	}

	// Use the extracted CORS middleware.
	r.Use(middleware.CORSMiddleware())

	authRoutes(r, db)
	productRoutes(r, db)
	warehouseRoutes(r, db)

	return r
}

// authRoutes groups and registers authentication and user-related endpoints.
func authRoutes(r *gin.Engine, db *gorm.DB) {
	auth := r.Group("/api")
	{
		auth.POST("/login/", handlers.LoginHandler(db))
		auth.POST("/register/", handlers.RegisterHandler(db))
		auth.PUT("/user/password/", middleware.AuthMiddleware(), handlers.ChangePasswordHandler(db))
		auth.DELETE("/user/", middleware.AuthMiddleware(), handlers.DeleteAccountHandler(db))
		auth.GET("/protected/", middleware.AuthMiddleware(), func(c *gin.Context) {
			email := c.GetString("email")
			c.JSON(http.StatusOK, gin.H{
				"message": "You have access!",
				"email":   email,
			})
		})
	}
}

func productRoutes(r *gin.Engine, db *gorm.DB) {
	products := r.Group("/api/products")
	{
		// GET /api/products/ to list all products.
		products.GET("/", handlers.GetProductsHandler(db))
		// GET /api/products/:id to get a single product.
		products.GET("/:id", handlers.GetProductHandler(db))
		// POST for registration.
		products.POST("/register", middleware.AuthMiddleware(), handlers.RegisterProductHandler(db))
		// PUT /api/products/:id to update a product.
		products.PUT("/:id", middleware.AuthMiddleware(), handlers.UpdateProductHandler(db))
	}
}

// warehouseRoutes groups and registers the warehouse endpoints.
func warehouseRoutes(r *gin.Engine, db *gorm.DB) {
	warehouses := r.Group("/api/warehouses")
	{
		// GET /api/warehouses/ returns all warehouses.
		warehouses.GET("/", handlers.GetWarehousesHandler(db))
	}
}
