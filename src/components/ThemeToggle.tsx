import React, { useEffect, useState } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

export default function ThemeToggle() {
  const [scheme, setScheme] = useState(() => {
    try {
      return document.documentElement.getAttribute('data-toolpad-color-scheme') || (localStorage.getItem('borali-color-scheme') ?? 'light')
    } catch (e) {
      return 'light'
    }
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem('borali-color-scheme')
      if (stored) {
        document.documentElement.setAttribute('data-toolpad-color-scheme', stored)
        setScheme(stored)
      }
    } catch (e) {
      /* ignore */
    }
  }, [])

  const toggle = () => {
    try {
      const next = scheme === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-toolpad-color-scheme', next)
      localStorage.setItem('borali-color-scheme', next)
      setScheme(next)
    } catch (e) {
      /* ignore */
    }
  }

  return (
    <div className="global-theme-toggle">
      <Tooltip title="Alternar tema">
        <IconButton onClick={toggle} size="large" aria-label="toggle theme">
          {scheme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Tooltip>
    </div>
  )
}
