# Build stage
FROM golang:1.23-alpine AS builder
WORKDIR /app
# Install git (if needed to download Go modules)
RUN apk update && apk add --no-cache git

# Copy go mod and sum files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code
COPY . .

# Build the binary (adjust to your main package path)
RUN CGO_ENABLED=0 GOOS=linux go build -o inventory-backend ./main.go

# Final image stage
FROM alpine:latest
WORKDIR /root/

# Copy the built binary from the builder stage.
COPY --from=builder /app/inventory-backend .

# Expose the port your Gin app uses (e.g. 8080)
EXPOSE 8080

# Run the binary.
CMD ["./inventory-backend"]