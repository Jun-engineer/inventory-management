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
	permissionRequestRoutes(r, db)
	purchaseRoutes(r, db)
	orderRoutes(r, db)
	salesRoutes(r, db)
	settingsRoutes(r, db)
	costRoutes(r, db)

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
		products.GET("/", middleware.AuthMiddleware(), handlers.GetProductsHandler(db))
		products.GET("/:id/", middleware.AuthMiddleware(), handlers.GetProductHandler(db))
		products.POST("/register/", middleware.AuthMiddleware(), handlers.RegisterProductHandler(db))
		products.PUT("/:id/", middleware.AuthMiddleware(), handlers.UpdateProductHandler(db))
		products.DELETE("/:id/", middleware.AuthMiddleware(), handlers.DeleteProductHandler(db))
	}
}

// warehouseRoutes groups and registers the warehouse endpoints.
func warehouseRoutes(r *gin.Engine, db *gorm.DB) {
	warehouses := r.Group("/api/warehouses")
	{
		warehouses.GET("/", middleware.AuthMiddleware(), handlers.GetWarehousesHandler(db))
		warehouses.GET("/:id/", middleware.AuthMiddleware(), handlers.GetWarehouseHandler(db))
		warehouses.PUT("/:id/", middleware.AuthMiddleware(), handlers.UpdateWarehouseHandler(db))
		warehouses.POST("/", middleware.AuthMiddleware(), handlers.AddWarehouseHandler(db))
		warehouses.DELETE("/:id/", middleware.AuthMiddleware(), handlers.DeleteWarehouseHandler(db))
	}
}

// permissionRequestRoutes groups and registers the permission request endpoints.
func permissionRequestRoutes(r *gin.Engine, db *gorm.DB) {
	permissionRequests := r.Group("/api/requests")
	{
		permissionRequests.GET("/", middleware.AuthMiddleware(), handlers.GetPermissionRequestsHandler(db))
		permissionRequests.GET("/search/", middleware.AuthMiddleware(), handlers.SearchPermissionRequestsHandler(db))
		permissionRequests.POST("/", middleware.AuthMiddleware(), handlers.SendPermissionRequestHandler(db))
		permissionRequests.PUT("/:requestId/", middleware.AuthMiddleware(), handlers.UpdatePermissionRequestHandler(db))
	}
}

func purchaseRoutes(r *gin.Engine, db *gorm.DB) {
	purchaseProducts := r.Group("/api/purchase-products")
	{
		purchaseProducts.GET("/", middleware.AuthMiddleware(), handlers.GetPurchaseProductsHandler(db))
	}
}

func orderRoutes(r *gin.Engine, db *gorm.DB) {
	orders := r.Group("/api/orders")
	{
		orders.POST("/", middleware.AuthMiddleware(), handlers.CreateOrderHandler(db))
		orders.GET("/", middleware.AuthMiddleware(), handlers.GetOrdersHandler(db))
		orders.PUT("/:id/accept/", middleware.AuthMiddleware(), handlers.AcceptOrderHandler(db))
		orders.PUT("/:id/deliver/", middleware.AuthMiddleware(), handlers.DeliverOrderHandler(db))
		orders.PUT("/:id/complete/", middleware.AuthMiddleware(), handlers.CompleteOrderHandler(db))
	}
}

func salesRoutes(r *gin.Engine, db *gorm.DB) {
	sales := r.Group("/api/sales")
	{
		sales.GET("/", middleware.AuthMiddleware(), handlers.GetSalesHandler(db))
	}
}

func settingsRoutes(r *gin.Engine, db *gorm.DB) {
	settings := r.Group("/api/settings")
	{
		settings.GET("/", middleware.AuthMiddleware(), handlers.GetSettingsHandler(db))
		settings.PUT("/update/", middleware.AuthMiddleware(), handlers.UpdateSettingsHandler(db))
		settings.PUT("/password/", middleware.AuthMiddleware(), handlers.ChangeCompanyPasswordHandler(db))
	}
}

func costRoutes(r *gin.Engine, db *gorm.DB) {
	costs := r.Group("/api/costs")
	{
		// GET /api/costs returns the aggregated cost management data.
		costs.GET("/", middleware.AuthMiddleware(), handlers.GetCostDataHandler(db))
	}
}
