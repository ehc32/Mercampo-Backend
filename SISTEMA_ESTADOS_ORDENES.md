# 📦 Sistema de Estados de Órdenes

## Estados Disponibles

| Estado | Descripción | Quién lo cambia |
|--------|-------------|----------------|
| `pending` | Orden recién creada, esperando confirmación del vendedor | Sistema (automático) |
| `preparing` | Vendedor está preparando el pedido | Vendedor |
| `shipped` | Pedido enviado al cliente | Vendedor |
| `delivered` | Pedido entregado al cliente | Vendedor |
| `completed` | Cliente confirmó que recibió todo correctamente | Cliente |
| `cancelled` | Orden cancelada | Admin/Vendedor |

## Flujo de Estados

```
┌─────────────┐
│  PENDIENTE  │ ← Cliente hace la compra
└──────┬──────┘
       │
       │ Vendedor confirma
       ▼
┌─────────────────┐
│ EN PREPARACIÓN  │ ← Vendedor empaca el pedido
└────────┬────────┘
         │
         │ Vendedor envía
         ▼
┌─────────────┐
│   ENVIADO   │ ← Pedido en camino
└──────┬──────┘
       │
       │ Vendedor entrega
       ▼
┌─────────────┐
│  ENTREGADO  │ ← Cliente recibe el pedido
└──────┬──────┘
       │
       │ Cliente confirma
       ▼
┌─────────────┐
│ COMPLETADO  │ ← Transacción finalizada ✅
└─────────────┘
```

## API Endpoints

### Actualizar Estado de Orden

**Endpoint:** `PATCH /orders/{order_id}/status/`

**Body:**
```json
{
  "status": "preparing"
}
```

**Respuesta:**
```json
{
  "detail": "Estado actualizado de pending a preparing",
  "order": {
    "id": 1,
    "status": "preparing",
    ...
  }
}
```

## Permisos

### Vendedor puede cambiar a:
- ✅ `preparing` - Cuando acepta la orden
- ✅ `shipped` - Cuando envía el paquete
- ✅ `delivered` - Cuando entrega el pedido

### Cliente puede cambiar a:
- ✅ `completed` - Solo cuando el estado es `delivered`

### Admin puede cambiar a:
- ✅ Cualquier estado

## Notificaciones Automáticas

El sistema envía notificaciones automáticas en estos momentos:

| Cambio de Estado | Notifica a | Mensaje |
|-----------------|------------|---------|
| `pending` → `shipped` | Cliente | "Tu orden #X ha sido enviada" |
| `shipped` → `delivered` | Cliente | "Tu orden #X ha sido entregada. Por favor confírmalo." |
| `delivered` → `completed` | Vendedor | "El cliente ha confirmado la recepción de la orden #X" |

## Uso en el Frontend

```typescript
import { updateOrderStatus, ORDER_STATUSES, getNextStatus, getButtonText } from '@/api/orderStatus'

// Actualizar estado
const handleUpdateStatus = async (orderId: number) => {
  const nextStatus = getNextStatus(currentStatus, 'seller')
  if (nextStatus) {
    await updateOrderStatus(orderId, nextStatus)
    toast.success('Estado actualizado')
  }
}

// Mostrar botón apropiado
const buttonText = getButtonText(order.status, userRole)
```

## Ejemplo de Implementación en Componente

```tsx
import { useState } from 'react'
import { updateOrderStatus, getNextStatus, getButtonText, ORDER_STATUSES } from '@/api/orderStatus'
import { Button } from '@mui/material'
import { toast } from 'react-toastify'

function OrderCard({ order, userRole }) {
  const [status, setStatus] = useState(order.status)
  const [loading, setLoading] = useState(false)

  const handleStatusUpdate = async () => {
    const nextStatus = getNextStatus(status, userRole)
    if (!nextStatus) return

    setLoading(true)
    try {
      const result = await updateOrderStatus(order.id, nextStatus)
      setStatus(result.order.status)
      toast.success('Estado actualizado correctamente')
    } catch (error) {
      toast.error('Error al actualizar el estado')
    } finally {
      setLoading(false)
    }
  }

  const buttonText = getButtonText(status, userRole)

  return (
    <div>
      <p>Estado actual: {ORDER_STATUSES[status]}</p>
      {buttonText && (
        <Button 
          onClick={handleStatusUpdate}
          disabled={loading}
        >
          {buttonText}
        </Button>
      )}
    </div>
  )
}
```

## Migraciones

Para aplicar los cambios en la base de datos:

```bash
python manage.py makemigrations orders
python manage.py migrate orders
```

## Notas Importantes

1. ⚠️ El campo `is_delivered` se mantiene por compatibilidad pero se actualiza automáticamente cuando el estado es `delivered`
2. ✅ Todas las transiciones de estado generan notificaciones
3. 🔒 Los permisos están validados en el backend
4. 📊 El admin puede ver todos los estados desde el panel

## Testing

Puedes probar el sistema con estos pasos:

1. Como **Cliente**: Crea una orden → Estado inicial: `pending`
2. Como **Vendedor**: Cambia a `preparing` → `shipped` → `delivered`
3. Como **Cliente**: Confirma con `completed`

¡El sistema está listo para usar! 🎉
