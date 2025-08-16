import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Radio,
  FormControlLabel
} from '@mui/material'
import {
  CreditCard,
  AccountBalance,
  Payment
} from '@mui/icons-material'

const PaymentMethodCard = ({ method, selected, onSelect, disabled }) => {
  const getIcon = () => {
    switch (method.id) {
      case 'gpay':
        return <Payment sx={{ fontSize: 32, color: '#4285f4' }} />
      case 'debit':
        return <AccountBalance sx={{ fontSize: 32, color: '#1976d2' }} />
      case 'credit':
        return <CreditCard sx={{ fontSize: 32, color: '#ff6b35' }} />
      default:
        return <Payment sx={{ fontSize: 32 }} />
    }
  }

  const getBrandColors = () => {
    switch (method.id) {
      case 'gpay':
        return {
          border: selected ? '#4285f4' : '#e0e0e0',
          background: selected ? 'linear-gradient(135deg, #e8f0fe 0%, #f8f9ff 100%)' : 'white'
        }
      case 'debit':
        return {
          border: selected ? '#1976d2' : '#e0e0e0',
          background: selected ? 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)' : 'white'
        }
      case 'credit':
        return {
          border: selected ? '#ff6b35' : '#e0e0e0',
          background: selected ? 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)' : 'white'
        }
      default:
        return {
          border: '#e0e0e0',
          background: 'white'
        }
    }
  }

  const colors = getBrandColors()

  return (
    <Card
      sx={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: `2px solid ${colors.border}`,
        background: colors.background,
        opacity: disabled ? 0.6 : 1,
        transform: selected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: selected ? '0 8px 24px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
        '&:hover': disabled ? {} : {
          transform: 'scale(1.02)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }
      }}
      onClick={() => !disabled && onSelect(method.id)}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <FormControlLabel
          value={method.id}
          control={<Radio checked={selected} disabled={disabled} />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 1 }}>
              {getIcon()}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {method.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {method.description}
                </Typography>
                {method.features && (
                  <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
                    {method.features}
                  </Typography>
                )}
              </Box>
            </Box>
          }
          sx={{ width: '100%', m: 0, alignItems: 'flex-start' }}
        />
      </CardContent>
    </Card>
  )
}

export default PaymentMethodCard