package config

import (
	"fmt"
	"log"
	"os"

	"backend/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitEnv() error {
	if os.Getenv("ENV") != "production" {
		if err := godotenv.Load(); err != nil {
			log.Printf("Warning: No .env file found, using environment variables from the system")
		}
	}
	return nil
}

func InitDB() (*gorm.DB, error) {
	// Load database DSN from environment variables.
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		if os.Getenv("ENV") == "production" {
			return nil, fmt.Errorf("DATABASE_URL environment variable is required in production")
		}
		// Fallback DSN for local development only.
		dsn = "host=localhost user=myuser password=mypassword dbname=inventory port=5432 sslmode=disable TimeZone=Asia/Tokyo"
		log.Println("Warning: Using fallback development DATABASE_URL")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	if err := db.AutoMigrate(
		&models.Companies{},
		&models.Warehouse{},
		&models.Products{},
		&models.InventoryStock{},
		&models.PermissionRequest{},
		&models.Order{},
		&models.OrderItem{},
	); err != nil {
		return nil, err
	}

	fmt.Println("Database initialized successfully")
	return db, nil
}
