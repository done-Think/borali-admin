import { type MouseEvent, useState } from 'react'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import { useNavigate } from 'react-router-dom'
import { Logout } from '@mui/icons-material'
import { Avatar, IconButton, ListItemIcon, Menu, MenuItem } from '@mui/material'
import { ThemeSwitcher } from '@toolpad/core/DashboardLayout'

export function LogoutToolbar() {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<O.Option<HTMLElement>>(O.none)

  const handleOpen = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(O.some(event.currentTarget))

  const handleClose = () => setAnchorEl(O.none)

  const handleLogout = () => {
    handleClose()
    navigate('/login')
  }

  return (
    <>
      <ThemeSwitcher />
      <IconButton onClick={handleOpen} sx={{ ml: 2, p: 0 }}>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            color: 'primary.main',
            backgroundColor: 'transparent',
          }}
        />
      </IconButton>
      {pipe(
        anchorEl,
        O.match(
          () => null,
          (el) => (
            <Menu
              anchorEl={el}
              open
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Sair
              </MenuItem>
            </Menu>
          ),
        ),
      )}
    </>
  )
}
