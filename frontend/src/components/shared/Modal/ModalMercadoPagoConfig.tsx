"use client"

import React, { useState, useEffect } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { get_mercadopago_config, save_mercadopago_config } from "../../../api/mercadopago"

interface ModalMercadoPagoConfigProps {
  userId: number
}

const ModalMercadoPagoConfig: React.FC<ModalMercadoPagoConfigProps> = ({ userId }) => {
  const [open, setOpen] = useState(false)
  const [publicKey, setPublicKey] = useState("")
  const [accessToken, setAccessToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [showAccessToken, setShowAccessToken] = useState(false)
  const [hasConfig, setHasConfig] = useState(false)
  const [refreshToken, setRefreshToken] = useState("")

  useEffect(() => {
    if (open && userId) {
      fetchConfig()
    }
  }, [open, userId])

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const response = await get_mercadopago_config(userId)
      
      if (response.data) {
        const data = response.data
        setPublicKey(data.public_key || "")
        setHasConfig(!!data.public_key)
        
        if (data.has_access_token) {
          setAccessToken("••••••••••••••••••••••••••••••••")
        } else {
          setAccessToken("")
        }
      }
    } catch (error) {
      console.error("Error al obtener configuración de Mercado Pago:", error)
      setError("Error al obtener la configuración. Verifique su conexión.")
    } finally {
      setLoading(false)
    }
  }

  const handleClickOpen = () => {
    setOpen(true)
    setSuccess(false)
    setError("")
  }

  const handleClose = () => {
    setOpen(false)
    setSuccess(false)
    setError("")
  }

  const handleSubmit = async () => {
    if (!publicKey.trim()) {
      setError("El Public Key es obligatorio")
      return
    }

    if (!accessToken.trim() || accessToken.includes("•")) {
      setError("Debe proporcionar un Access Token válido")
      return
    }

    try {
      setLoading(true)
      setError("")

      const configData = {
        user_id: userId,  // Ahora es obligatorio
        public_key: publicKey,
        access_token: accessToken,
        refresh_token: refreshToken,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const response = await save_mercadopago_config(configData)
      
      if (response.success) {
        setSuccess(true)
        setHasConfig(true)
        setAccessToken("••••••••••••••••••••••••••••••••")
      } else {
        setError(response.message || "Error al guardar la configuración")
      }
    } catch (error: any) {
      console.error("Error al guardar configuración de Mercado Pago:", error)
      setError(error.response?.data?.message || "Error al guardar la configuración. Verifique sus credenciales.")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAccessTokenVisibility = () => {
    setShowAccessToken(!showAccessToken)
  }

  const handleAccessTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (accessToken.includes("•")) {
      setAccessToken(e.target.value)
    } else {
      setAccessToken(e.target.value)
    }
  }

  return (
    <>
      <Button
        onClick={handleClickOpen}
        variant="contained"
        style={{ backgroundColor: "#009ee3", color: "white" }}
        className="focus:outline-none"
      >
        {hasConfig ? "Editar Configuración" : "Configurar Mercado Pago"}
      </Button>
      
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {hasConfig ? "Editar Configuración de Mercado Pago" : "Configurar Mercado Pago"}
        </DialogTitle>
        
        <DialogContent>
          <DialogContentText>
            {hasConfig 
              ? "Actualice sus credenciales de Mercado Pago para procesar pagos."
              : "Configure sus credenciales de Mercado Pago para procesar pagos."}
          </DialogContentText>

          {loading ? (
            <div className="flex justify-center my-4">
              <CircularProgress style={{ color: "#009ee3" }} />
            </div>
          ) : (
            <>
              {success && (
                <Alert severity="success" className="my-3">
                  Configuración guardada correctamente
                </Alert>
              )}

              {error && (
                <Alert severity="error" className="my-3">
                  {error}
                </Alert>
              )}

              <TextField
                margin="dense"
                label="Public Key"
                type="text"
                fullWidth
                variant="outlined"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                className="mb-4"
                disabled={loading}
              />

              <TextField
                margin="dense"
                label="Access Token"
                type={showAccessToken ? "text" : "password"}
                fullWidth
                variant="outlined"
                value={accessToken}
                onChange={handleAccessTokenChange}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleToggleAccessTokenVisibility}
                        edge="end"
                        disabled={loading}
                      >
                        {showAccessToken ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h4 className="text-blue-800 font-medium mb-2">¿Cómo obtener sus credenciales?</h4>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                  <li>
                    Inicie sesión en su cuenta de{" "}
                    <a
                      href="https://www.mercadopago.com.co"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Mercado Pago
                    </a>
                  </li>
                  <li>
                    Vaya a la sección de{" "}
                    <a
                      href="https://www.mercadopago.com.co/developers/panel"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Desarrolladores
                    </a>
                  </li>
                  <li>Cree una aplicación o seleccione una existente</li>
                  <li>Copie la Public Key y el Access Token de producción</li>
                  <li>Pegue las credenciales en este formulario</li>
                  <li className="text-red-600 font-medium">
                    IMPORTANTE: Estas credenciales son sensibles. No las comparta con nadie.
                  </li>
                </ol>
              </div>
            </>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={handleClose} 
            style={{ color: "#666" }}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            style={{ 
              backgroundColor: loading ? "#ccc" : "#009ee3", 
              color: "white",
              minWidth: "100px"
            }}
          >
            {loading ? (
              <CircularProgress size={24} style={{ color: "white" }} />
            ) : hasConfig ? (
              "Actualizar"
            ) : (
              "Guardar"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ModalMercadoPagoConfig