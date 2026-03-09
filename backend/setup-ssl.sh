#!/bin/bash

# ============================================================
# Valencia VGuides - SSL Certificate Setup Helper
# 
# Este script ayuda a generar e instalar certificados SSL/TLS
# para el backend en desarrollo y producción.
# ============================================================

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CERTS_DIR="$SCRIPT_DIR/certs"
CERT_FILE="$CERTS_DIR/cert.pem"
KEY_FILE="$CERTS_DIR/key.pem"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════╗"
echo "║  Valencia VGuides - SSL Certificate Setup      ║"
echo "╚════════════════════════════════════════════════╝"
echo -e "${NC}"

# Crear directorio de certificados
if [ ! -d "$CERTS_DIR" ]; then
    echo -e "${YELLOW}📁 Creando directorio: $CERTS_DIR${NC}"
    mkdir -p "$CERTS_DIR"
fi

# Verificar si los certificados ya existen
if [ -f "$CERT_FILE" ] && [ -f "$KEY_FILE" ]; then
    echo -e "${GREEN}✓ Certificados encontrados:${NC}"
    echo "   Certificado: $CERT_FILE"
    echo "   Clave privada: $KEY_FILE"
    
    # Mostrar información del certificado
    if command -v openssl &> /dev/null; then
        echo ""
        echo -e "${BLUE}Información del certificado:${NC}"
        openssl x509 -in "$CERT_FILE" -noout -text | grep -E "Not Before|Not After|Subject|Public-Key"
    fi
    
    echo ""
    read -p "¿Deseas generar nuevos certificados? (s/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo -e "${GREEN}✓ Configuración lista${NC}"
        exit 0
    fi
fi

# Función para generar certificado autofirmado
generate_self_signed() {
    echo -e "${YELLOW}🔐 Generando certificado autofirmado...${NC}"
    
    openssl req -x509 -newkey rsa:2048 \
        -keyout "$KEY_FILE" \
        -out "$CERT_FILE" \
        -days 365 \
        -nodes \
        -subj "/C=ES/ST=Valencia/L=Valencia/O=Valencia VGuides/CN=valenciavguides.es"
    
    chmod 644 "$CERT_FILE"
    chmod 600 "$KEY_FILE"
    
    echo -e "${GREEN}✓ Certificado generado exitosamente${NC}"
    echo "   Certificado: $CERT_FILE"
    echo "   Clave privada: $KEY_FILE"
    echo "   Válido por: 365 días"
}

# Función para crear archivo .env
setup_env() {
    if [ ! -f "$SCRIPT_DIR/.env" ]; then
        echo -e "${YELLOW}📝 Creando archivo .env${NC}"
        cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
        echo -e "${GREEN}✓ Archivo .env creado${NC}"
        echo "   Localización: $SCRIPT_DIR/.env"
        echo "   Por favor, actualiza los valores según sea necesario"
    else
        echo -e "${GREEN}✓ Archivo .env ya existe${NC}"
    fi
}

# Menú principal
echo ""
echo "Opciones:"
echo "1) Generar certificado autofirmado (desarrollo)"
echo "2) Solo crear archivo .env"
echo "3) Verificar certificados existentes"
echo ""

read -p "Selecciona una opción (1-3): " option

case $option in
    1)
        generate_self_signed
        setup_env
        ;;
    2)
        setup_env
        ;;
    3)
        if [ -f "$CERT_FILE" ] && [ -f "$KEY_FILE" ]; then
            echo -e "${GREEN}✓ Certificados encontrados${NC}"
            if command -v openssl &> /dev/null; then
                echo ""
                openssl x509 -in "$CERT_FILE" -noout -text
            fi
        else
            echo -e "${RED}✗ No se encontraron certificados${NC}"
        fi
        ;;
    *)
        echo -e "${RED}Opción inválida${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Configuración completada${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo ""
echo "Pasos siguientes:"
echo ""
echo "1. Desarrollo (HTTP en localhost):"
echo "   npm run dev"
echo ""
echo "2. Producción (HTTPS):"
echo "   NODE_ENV=production npm start"
echo ""
echo "3. Con certificados Let's Encrypt:"
echo "   - Instala Certbot: https://certbot.eff.org/"
echo "   - Genera certificado para tu dominio"
echo "   - Copia cert.pem y privkey.pem a./certs/"
echo ""
