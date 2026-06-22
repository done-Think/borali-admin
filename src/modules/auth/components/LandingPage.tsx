import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CheckIcon from '@mui/icons-material/Check'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import GroupsIcon from '@mui/icons-material/Groups'
import HubIcon from '@mui/icons-material/Hub'
import PaidIcon from '@mui/icons-material/Paid'
import PlaceIcon from '@mui/icons-material/Place'
import SecurityIcon from '@mui/icons-material/Security'
import StarIcon from '@mui/icons-material/Star'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import VisibilityIcon from '@mui/icons-material/Visibility'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import { Box, Button, Stack, Typography } from '@mui/material'
import { IconButton, Tooltip } from '@mui/material'
import { useAuthStore } from '@shared/store'
import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import carTopView from '@/assets/car-top-view-transparent.png'
import driverGpsNavigatorBlue from '@/assets/illustrations/driver-gps-navigator-cuate-blue.svg'
import driverGpsNavigatorGreen from '@/assets/illustrations/driver-gps-navigator-cuate-green.svg'
import passengerLocationBlue from '@/assets/illustrations/passenger-location-blue.svg'
import passengerLocationGreen from '@/assets/illustrations/passenger-location-tracking-cuate-green.svg'
import loginMapBg from '@/assets/login-map-bg.png'
import logo from '@/assets/logo.png'

const navLinks = ['Passageiros', 'Motoristas', 'Valores', 'Segurança', 'Sobre nós']

const benefits = [
  {
    icon: PaidIcon,
    title: 'Preço justo',
    description: 'Tarifas equilibradas para todos.',
    bullets: ['Sem taxas abusivas', 'Mais ganhos para motoristas', 'Viagens com ótimo custo-benefício'],
  },
  {
    icon: VisibilityIcon,
    title: 'Transparência',
    description: 'Informações claras em cada etapa.',
    bullets: ['Você sabe o valor antes de aceitar', 'Acompanhamento em tempo real', 'Relatórios completos de cada viagem'],
  },
  {
    icon: SecurityIcon,
    title: 'Segurança',
    description: 'Tecnologia e processos para sua proteção.',
    bullets: ['Verificação de usuários', 'Suporte 24h', 'Monitoramento de viagens'],
  },
  {
    icon: StarIcon,
    title: 'Valorização do motorista',
    description: 'Mais respeito, melhores condições e autonomia.',
    bullets: ['Mais autonomia para decidir', 'Incentivos e recompensas', 'Ferramentas que facilitam seu dia'],
  },
]

const solutions = [
  {
    icon: GroupsIcon,
    title: 'Para passageiros',
    text: 'Peça viagens de forma simples, acessível e transparente.',
    bullets: ['Preços justos', 'Viagens rápidas e seguras', 'Avalie e escolha seu motorista'],
    visual: 'passenger',
  },
  {
    icon: DirectionsCarIcon,
    title: 'Para motoristas',
    text: 'Mais autonomia e uma relação mais justa com a plataforma.',
    bullets: ['Mais ganhos', 'Flexibilidade de horários', 'Suporte humanizado'],
    visual: 'driver',
  },
  {
    icon: DashboardIcon,
    title: 'Gestão BorAli',
    text: 'Acompanhe operações, acessos e informações do painel administrativo.',
    bullets: ['Dashboard completo', 'Relatórios inteligentes', 'Gestão de usuários e motoristas'],
    visual: 'dashboard',
  },
]

const featureBlocks = [
  { icon: CreditCardIcon, title: 'Pagamento seguro', description: 'Transações protegidas e confiáveis.' },
  { icon: StarIcon, title: 'Avaliações reais', description: 'Feedbacks que constroem confiança.' },
  { icon: SupportAgentIcon, title: 'Suporte 24h', description: 'Atendimento humano sempre que precisar.' },
  { icon: HubIcon, title: 'Tecnologia inteligente', description: 'Soluções que tornam tudo mais eficiente.' },
  { icon: AutoAwesomeIcon, title: 'Comunidade', description: 'Juntos por uma mobilidade melhor.' },
]

const pricingPlans = [
  {
    icon: AccessTimeIcon,
    title: 'Plano Diário',
    price: 'R$ 19,90',
    period: '/ dia',
    description: 'Ideal para quem roda ocasionalmente.',
    benefits: ['Sem cobrança por km rodado', 'Acesso completo à plataforma', 'Mais previsibilidade de ganhos'],
  },
  {
    icon: CalendarMonthIcon,
    title: 'Plano Semanal',
    price: 'R$ 69,90',
    period: '/ semana',
    description: 'Perfeito para rotina flexível.',
    benefits: ['Sem cobrança por km rodado', 'Acesso completo à plataforma', 'Mais previsibilidade de ganhos'],
  },
  {
    icon: WorkspacePremiumIcon,
    title: 'Plano Mensal',
    price: 'R$ 149,90',
    period: '/ mês',
    description: 'Melhor custo-benefício para motoristas frequentes.',
    benefits: ['Sem cobrança por km rodado', 'Acesso completo à plataforma', 'Mais previsibilidade de ganhos', 'Suporte prioritário'],
    popular: true,
  },
]

const stats = [
  { value: '+25K', title: 'Viagens realizadas', description: 'Todos os dias' },
  { value: '+8K', title: 'Motoristas parceiros', description: 'Ativos na plataforma' },
  { value: '+50K', title: 'Passageiros satisfeitos', description: 'Em toda a região' },
  { value: '4,9/5', title: 'Avaliação do app', description: 'Nota média dos usuários' },
]

const testimonials = [
  {
    name: 'Mariana Souza',
    text: 'Uso todos os dias e me sinto muito mais segura. Os preços são claros e as opções são ótimas.',
    initials: 'MS',
  },
  {
    name: 'Carlos Lima',
    text: 'Como motorista, finalmente me sinto valorizado. A plataforma é clara e o suporte funciona.',
    initials: 'CL',
  },
  {
    name: 'Juliana Mendes',
    text: 'Prático, rápido e transparente. A melhor experiência que já tive com transporte por app.',
    initials: 'JM',
  },
]

const pageWidth = 'min(1220px, calc(100% - 32px))'

function SectionTitle({ children, sx }: { children: string; sx?: any }) {
  return (
    <Stack spacing={1.25} alignItems="center" sx={{ mb: { xs: 3.5, md: 5 }, ...(sx ?? {}) }}>
      <Typography variant="h2" sx={{ color: 'var(--text-primary)', fontSize: { xs: 22, md: 26 }, fontWeight: 900 }}>
        {children}
      </Typography>
      <Box sx={{ width: 54, height: 2, borderRadius: 999, bgcolor: 'var(--color-primary)', boxShadow: '0 0 18px var(--color-accent)' }} />
    </Stack>
  )
}

function GlassIcon({ icon: Icon, className }: { icon: typeof PaidIcon; className?: string }) {
  return (
    <Box
      className={`pulse-icon${className ? ` ${className}` : ''}`}
      sx={{
        width: 44,
        height: 44,
        display: 'grid',
        placeItems: 'center',
        borderRadius: '50%',
        color: 'var(--color-primary)',
        border: '1px solid var(--accent-border)',
        bgcolor: 'var(--accent-soft)',
        boxShadow: 'inset 0 0 18px var(--accent-soft), 0 0 14px var(--accent-glow)',
      }}
    >
      <Icon sx={{ fontSize: 22, color: 'var(--color-primary)' }} />
    </Box>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <Stack spacing={1.25}>
      {items.map((item) => (
        <Stack
          key={item}
          className="benefit-bullet"
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ transition: 'transform .28s ease' }}
        >
          <CheckIcon
            className="benefit-check"
            sx={{ color: 'var(--color-primary)', fontSize: 16, transition: 'transform .28s ease, filter .28s ease' }}
          />
          <Typography
            className="benefit-bullet-text"
            sx={{ color: 'var(--text-secondary)', fontSize: 13, transition: 'color .28s ease' }}
          >
            {item}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}

function MiniMap({ secure = false }: { secure?: boolean }) {
  const scheme = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-toolpad-color-scheme') || 'light' : 'light'
  const isLight = scheme === 'light'

  return (
    <Box
      sx={{
        position: 'relative',
        height: 160,
        mt: 3,
        borderRadius: 4,
        border: isLight ? '1px solid rgba(45, 212, 160, 0.14)' : '1px solid rgba(0, 200, 255, 0.18)',
        overflow: 'hidden',
        bgcolor: isLight ? '#fbfffd' : 'rgba(2, 11, 19, 0.78)',
        backgroundImage: isLight
          ? 'linear-gradient(rgba(45,212,160,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,160,0.07) 1px, transparent 1px), radial-gradient(circle, rgba(45,212,160,0.16) 1px, transparent 1.5px)'
          : 'linear-gradient(rgba(0,200,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.05) 1px, transparent 1px)',
        backgroundSize: isLight ? '28px 28px, 28px 28px, 42px 42px' : '28px 28px',
      }}
    >
      {secure ? (
        <>
          <Box
            sx={{
              position: 'absolute',
              left: '28%',
              top: '62%',
              width: '50%',
              height: 28,
              transform: 'rotate(-20deg)',
              transformOrigin: 'left center',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: '50%',
                height: 3,
                borderRadius: 999,
                background: isLight ? 'linear-gradient(90deg, #13b981, #18c98f)' : 'linear-gradient(90deg, #16d9ff, #00c8ff)',
                boxShadow: isLight ? '0 0 10px rgba(45,212,160,0.26)' : '0 0 14px rgba(0,200,255,0.72)',
                transform: 'translateY(-50%)',
              }}
            />
            <PlaceIcon
              sx={{
                position: 'absolute',
                left: -13,
                top: '50%',
                color: isLight ? '#13b981' : '#9eefff',
                fontSize: 24,
                transform: 'translateY(-50%) rotate(20deg)',
              }}
            />
            <PlaceIcon
              sx={{
                position: 'absolute',
                right: -15,
                top: '50%',
                color: isLight ? '#0faa72' : '#16d9ff',
                fontSize: 28,
                transform: 'translateY(-50%) rotate(20deg)',
              }}
            />
            <Box
              component="img"
              src={carTopView}
              alt="Carro em rota"
              sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                width: { xs: 24, sm: 30 },
                height: 'auto',
                objectFit: 'contain',
                animation: 'carToDestination 5.2s linear infinite',
                filter: isLight
                  ? 'drop-shadow(0 7px 12px rgba(16, 24, 40, 0.12))'
                  : 'drop-shadow(0 0 10px rgba(0, 200, 255, 0.35)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.30))',
                transform: 'translateY(-50%) rotate(90deg)',
                zIndex: 2,
                pointerEvents: 'none',
                transition: 'transform 0.3s ease, filter 0.3s ease',
              }}
            />
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{
              position: 'absolute',
              inset: '30px 48px 52px 88px',
              borderTop: isLight ? '3px solid #13b981' : '3px solid #00c8ff',
              borderRight: isLight ? '3px solid #13b981' : '3px solid #00c8ff',
              transform: 'skew(-18deg) rotate(-28deg)',
              borderRadius: 2,
              filter: isLight ? 'drop-shadow(0 0 8px rgba(45,212,160,0.22))' : 'drop-shadow(0 0 10px rgba(0,200,255,0.55))',
            }}
          />
          <PlaceIcon sx={{ position: 'absolute', top: 36, right: 68, color: isLight ? '#0faa72' : '#16d9ff' }} />
          <PlaceIcon sx={{ position: 'absolute', bottom: 48, left: 112, color: isLight ? '#13b981' : '#9eefff', fontSize: 20 }} />
        </>
      )}
      {secure ? (
        <>
          <Box sx={{ position: 'absolute', top: 26, left: 24 }}>
            <Typography sx={{ color: isLight ? 'var(--text-primary)' : '#f7fbff', fontWeight: 800, fontSize: 13 }}>A caminho do destino</Typography>
            <Typography sx={{ color: isLight ? 'var(--text-secondary)' : 'rgba(230,241,248,0.72)', fontSize: 12 }}>12 min</Typography>
            <Typography sx={{ color: isLight ? 'var(--text-secondary)' : 'rgba(230,241,248,0.72)', fontSize: 12 }}>3,2 km</Typography>
          </Box>
        </>
      ) : (
        <Stack spacing={1} sx={{ position: 'absolute', left: 24, right: 24, bottom: 22 }}>
          {['Origem', 'Destino'].map((label) => (
            <Stack
              key={label}
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ px: 1.5, py: 1, borderRadius: 2, bgcolor: isLight ? 'rgba(255,255,255,0.88)' : 'rgba(0, 9, 16, 0.58)' }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', border: isLight ? '1px solid #13b981' : '1px solid #00c8ff' }} />
              <Typography sx={{ color: isLight ? 'var(--text-secondary)' : 'rgba(230,241,248,0.68)', fontSize: 12 }}>{label}</Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  )
}

function RouteMockup() {
  const scheme = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-toolpad-color-scheme') || 'light' : 'light'
  const isLight = scheme === 'light'

  return (
    <Box
      sx={{
        position: 'relative',
        mt: 2.4,
        height: 158,
        borderRadius: 4,
        overflow: 'hidden',
        border: isLight ? '1px solid var(--borders)' : '1px solid rgba(0, 200, 255, 0.18)',
        bgcolor: isLight ? 'var(--bg-card)' : 'rgba(2, 11, 19, 0.82)',
        backgroundImage: isLight
          ? `linear-gradient(90deg, rgba(45,212,160,0.02) 1px, transparent 1px), linear-gradient(rgba(45,212,160,0.02) 1px, transparent 1px)`
          : 'radial-gradient(circle at 78% 24%, rgba(0,200,255,.16), transparent 7%), linear-gradient(rgba(0,200,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.055) 1px, transparent 1px)',
        backgroundSize: isLight ? '28px 28px, 28px 28px' : '100% 100%, 28px 28px, 28px 28px',
        boxShadow: isLight ? 'var(--shadows)' : 'inset 0 0 34px rgba(0, 200, 255, 0.05)',
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 320 158"
        preserveAspectRatio="none"
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
      >
        <Box
          component="path"
          d="M92 88 C132 70, 186 42, 238 28"
          sx={{
            fill: 'none',
            stroke: 'var(--color-primary)',
            strokeWidth: 3,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            filter: isLight ? 'none' : 'drop-shadow(0 0 8px rgba(0, 200, 255, 0.65))',
          }}
        />
      </Box>
      <PlaceIcon
        sx={{
          position: 'absolute',
          left: '28.75%',
          top: '55.7%',
          color: isLight ? 'rgba(45,212,160,0.9)' : '#9eefff',
          fontSize: 24,
          zIndex: 3,
          transform: 'translate(-50%, -100%)',
        }}
      />
      <PlaceIcon
        sx={{
          position: 'absolute',
          left: '74.4%',
          top: '17.7%',
          color: 'var(--color-primary)',
          fontSize: 24,
          zIndex: 3,
          transform: 'translate(-50%, -100%)',
        }}
      />
      <Box sx={{ position: 'absolute', left: '80%', top: '21%', width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--color-primary)', boxShadow: isLight ? '0 0 8px rgba(45,212,160,0.08)' : '0 0 16px #16d9ff', zIndex: 2 }} />
      <Stack spacing={1} sx={{ position: 'absolute', left: 18, right: 18, bottom: 16 }}>
        {['Origem', 'Destino'].map((label, index) => (
          <Stack
            key={label}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 1.2, py: 0.8, borderRadius: 2, bgcolor: isLight ? 'rgba(255,255,255,0.9)' : 'rgba(0, 8, 14, 0.58)', border: isLight ? '1px solid rgba(16,24,40,0.04)' : '1px solid rgba(0,200,255,0.08)' }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', border: `1px solid ${isLight ? 'rgba(45,212,160,0.22)' : '#00c8ff'}`, bgcolor: index === 0 ? 'transparent' : isLight ? 'rgba(45,212,160,0.12)' : 'rgba(0,200,255,.22)' }} />
              <Typography sx={{ color: isLight ? 'var(--text-secondary)' : 'rgba(230,241,248,0.62)', fontSize: 11 }}>{label}</Typography>
            </Stack>
            <Box sx={{ width: 18, height: 8, borderRadius: 999, bgcolor: isLight ? 'rgba(16,24,40,0.04)' : 'rgba(0,200,255,.14)' }} />
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}

function DriverConnectMockup() {
  const scheme = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-toolpad-color-scheme') || 'light' : 'light'
  const isLight = scheme === 'light'

  return (
    <Box
      sx={{
        position: 'relative',
        mt: 2.4,
        minHeight: 158,
        overflow: 'hidden',
        borderRadius: 4,
        border: isLight ? '1px solid var(--borders)' : '1px solid rgba(0, 200, 255, 0.18)',
        background: isLight ? 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,255,251,0.96))' : 'linear-gradient(135deg, rgba(3, 16, 28, 0.86), rgba(5, 24, 39, 0.74))',
        boxShadow: isLight ? 'var(--shadows)' : 'inset 0 0 30px rgba(0, 200, 255, 0.04), 0 18px 40px rgba(0, 0, 0, 0.28)',
        p: 2.2,
        '&::after': isLight
          ? undefined
          : {
              content: '""',
              position: 'absolute',
              right: -35,
              bottom: -35,
              width: 160,
              height: 110,
              background: 'radial-gradient(circle, rgba(0, 200, 255, 0.18), transparent 65%)',
              zIndex: 0,
            },
        '&:hover .driver-car': isLight
          ? undefined
          : {
              transform: 'translateY(-3px) scale(1.02)',
              filter: 'drop-shadow(0 18px 28px rgba(0, 200, 255, 0.32)) drop-shadow(0 8px 18px rgba(0, 0, 0, 0.45))',
            },
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ position: 'relative', zIndex: 2, maxWidth: { xs: '62%', sm: '58%' } }}>
        <Box
          sx={{
            width: 54,
            height: 54,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            flex: '0 0 54px',
            fontWeight: 950,
            color: '#02101a',
            background: isLight ? 'linear-gradient(135deg, rgba(45,212,160,0.12), rgba(255,255,255,0.9))' : 'linear-gradient(135deg, #62e5ff, #12cfff)',
            boxShadow: isLight ? '0 6px 18px rgba(16,24,40,0.04)' : '0 0 24px rgba(0, 200, 255, 0.3)',
          }}
        >
          <Typography sx={{ color: 'var(--text-primary)', fontWeight: 900 }}>JS</Typography>
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: isLight ? 'var(--text-primary)' : '#f7fbff', fontWeight: 950, fontSize: 14 }}>João Silva</Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <StarIcon sx={{ color: '#ffc857', fontSize: 14 }} />
            <Typography sx={{ color: isLight ? 'var(--text-secondary)' : 'rgba(230,241,248,0.78)', fontSize: 11 }}>4.9</Typography>
          </Stack>
          <Typography sx={{ color: isLight ? 'var(--color-primary)' : '#16d9ff', fontSize: 11, fontWeight: 800 }}>Motorista parceiro</Typography>
        </Box>
      </Stack>
      <Stack spacing={0.6} sx={{ position: 'relative', zIndex: 2, mt: 1.4, maxWidth: { xs: '58%', sm: '54%' } }}>
        <Typography sx={{ color: isLight ? 'var(--text-secondary)' : 'rgba(230,241,248,0.84)', fontSize: 12.5 }}>Volkswagen T-Cross - Prata</Typography>
        <Typography sx={{ color: isLight ? 'var(--text-secondary)' : 'rgba(230,241,248,0.84)', fontSize: 12.5, letterSpacing: 0.5 }}>ABC-1023</Typography>
      </Stack>
      <Box
        component="img"
        className="driver-car"
        src="https://pngimg.com/uploads/volkswagen/volkswagen_PNG1820.png"
        alt="Carro do motorista"
        sx={{
          position: 'absolute',
          right: { xs: 12, sm: 18 },
          bottom: { xs: 14, sm: 12 },
          width: { xs: 106, sm: 140 },
          maxWidth: { xs: '42%', sm: '44%' },
          height: 'auto',
          zIndex: 1,
          objectFit: 'contain',
          opacity: 0.98,
          pointerEvents: 'none',
          transition: 'transform 0.3s ease, filter 0.3s ease',
          filter: isLight ? 'drop-shadow(0 8px 18px rgba(16,24,40,0.06))' : 'drop-shadow(0 14px 24px rgba(0, 200, 255, 0.22)) drop-shadow(0 8px 18px rgba(0, 0, 0, 0.42))',
        }}
      />
    </Box>
  )
}

function TrackingMockup() {
  const scheme = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-toolpad-color-scheme') || 'light' : 'light'
  const isLight = scheme === 'light'

  return (
    <Box
      sx={{
        position: 'relative',
        mt: 2.4,
        height: 158,
        borderRadius: 4,
        overflow: 'hidden',
        border: isLight ? '1px solid var(--borders)' : '1px solid rgba(0, 200, 255, 0.18)',
        bgcolor: isLight ? 'var(--bg-card)' : 'rgba(2, 11, 19, 0.82)',
        backgroundImage: isLight
          ? `linear-gradient(90deg, rgba(45,212,160,0.02) 1px, transparent 1px), linear-gradient(rgba(45,212,160,0.02) 1px, transparent 1px)`
          : 'radial-gradient(circle at 86% 21%, rgba(0,200,255,.18), transparent 7%), linear-gradient(rgba(0,200,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.055) 1px, transparent 1px)',
        backgroundSize: isLight ? '28px 28px, 28px 28px' : '100% 100%, 28px 28px, 28px 28px',
        boxShadow: isLight ? 'var(--shadows)' : 'inset 0 0 34px rgba(0, 200, 255, 0.05)',
      }}
    >
      <Box sx={{ position: 'absolute', top: 18, left: 18 }}>
        <Typography sx={{ color: isLight ? 'var(--text-primary)' : '#f7fbff', fontWeight: 900, fontSize: 12 }}>A caminho do destino</Typography>
        <Typography sx={{ color: isLight ? 'var(--text-secondary)' : 'rgba(230,241,248,0.68)', fontSize: 11 }}>12 min</Typography>
        <Typography sx={{ color: isLight ? 'var(--text-secondary)' : 'rgba(230,241,248,0.68)', fontSize: 11 }}>3,2 km</Typography>
      </Box>
      <Box
        component="svg"
        viewBox="0 0 320 158"
        preserveAspectRatio="none"
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
      >
        <Box
          component="path"
          d="M70 116 C112 98, 156 78, 204 51 C228 38, 246 29, 262 24"
          sx={{
            fill: 'none',
            stroke: 'var(--color-primary)',
            strokeWidth: 3,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            filter: isLight ? 'none' : 'drop-shadow(0 0 8px rgba(0, 200, 255, 0.65))',
          }}
        />
      </Box>
      <PlaceIcon
        sx={{
          position: 'absolute',
          left: '21.9%',
          top: '73.4%',
          color: isLight ? 'rgba(45,212,160,0.9)' : '#9eefff',
          fontSize: 24,
          zIndex: 3,
          transform: 'translate(-50%, -100%)',
        }}
      />
      <PlaceIcon
        sx={{
          position: 'absolute',
          left: '81.9%',
          top: '15.2%',
          color: 'var(--color-primary)',
          fontSize: 26,
          zIndex: 3,
          transform: 'translate(-50%, -100%)',
        }}
      />
      <Box
        component="img"
        src={carTopView}
        alt="Carro em rota"
        sx={{
          position: 'absolute',
          left: '21.9%',
          top: '73.4%',
          width: { xs: 24, sm: 28 },
          height: 'auto',
          objectFit: 'contain',
          transform: 'translate(-50%, -50%) rotate(62deg)',
          animation: 'trackingCarFloat 5.2s linear infinite',
          filter: isLight ? 'drop-shadow(0 6px 12px rgba(16,24,40,0.06))' : 'drop-shadow(0 0 8px rgba(0, 200, 255, 0.42)) drop-shadow(0, 6px 12px rgba(0, 0, 0, 0.35))',
          zIndex: 4,
          pointerEvents: 'none',
          transition: 'transform 0.3s ease, filter 0.3s ease',
        }}
      />
      <Box sx={{ position: 'absolute', left: '86%', top: '16%', width: 8, height: 8, borderRadius: '50%', bgcolor: 'var(--color-primary)', boxShadow: isLight ? '0 0 8px rgba(45,212,160,0.06)' : '0 0 16px #16d9ff', zIndex: 2 }} />
    </Box>
  )
}

export function LandingPage() {
  const navigate = useNavigate()
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    if (accessToken) {
      navigate('/admin', { replace: true })
    }
  }, [accessToken, navigate])

  const goToLogin = () => navigate('/login')
  const cardSx = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 5,
    border: '1px solid rgba(0, 194, 255, 0.2)',
    background:
      'radial-gradient(circle at 18% 0%, rgba(0, 200, 255, 0.12), transparent 34%), linear-gradient(145deg, rgba(6, 24, 40, 0.88), rgba(3, 10, 18, 0.82))',
    boxShadow: '0 24px 70px rgba(0, 0, 0, 0.32), inset 0 0 34px rgba(0, 200, 255, 0.04)',
    backdropFilter: 'blur(14px)',
    transition: 'transform .28s ease, border-color .28s ease, box-shadow .28s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      borderColor: 'rgba(0, 200, 255, 0.46)',
      boxShadow: '0 30px 90px rgba(0, 200, 255, 0.12), inset 0 0 42px rgba(0, 200, 255, 0.08)',
    },
  } as const

  const [colorScheme, setColorScheme] = useState(() => {
    try {
      return document.documentElement.getAttribute('data-toolpad-color-scheme') || 'light'
    } catch (e) {
      return 'light'
    }
  })

  const isLight = colorScheme === 'light'
  const premiumHoverEase = 'cubic-bezier(0.22, 1, 0.36, 1)'
  const premiumHoverTransition = [
    `transform 360ms ${premiumHoverEase}`,
    `box-shadow 360ms ${premiumHoverEase}`,
    'border-color 300ms ease',
    'background-color 300ms ease',
  ].join(', ')

  const solutionCardVisualSx = {
    ...(colorScheme === 'light'
      ? {
          background: 'var(--bg-card)',
          border: '1px solid var(--borders)',
          boxShadow: 'var(--shadows)',
          p: 3,
          minHeight: 300,
          borderRadius: 4,
        }
      : { ...cardSx, p: 3, minHeight: 300 }),
    position: 'relative',
    overflow: 'hidden',
    transform: 'translate3d(0, 0, 0)',
    willChange: 'transform, box-shadow',
    backfaceVisibility: 'hidden',
    transition: premiumHoverTransition,
    '& .pulse-icon': {
      transform: 'translate3d(0, 0, 0) scale(1)',
      willChange: 'transform, box-shadow',
      backfaceVisibility: 'hidden',
      transition: premiumHoverTransition,
    },
    '&:hover': {
      transform: 'translate3d(0, -4px, 0)',
      borderColor: isLight ? 'var(--color-primary)' : 'rgba(0, 200, 255, 0.46)',
      boxShadow: isLight
        ? '0 20px 40px rgba(16,24,40,0.06)'
        : '0 30px 90px rgba(0, 200, 255, 0.12), inset 0 0 42px rgba(0, 200, 255, 0.08)',
      '& .pulse-icon': {
        transform: 'translate3d(0, 0, 0) scale(1.03)',
        borderColor: isLight ? 'rgba(45,212,160,0.3)' : 'rgba(0,200,255,0.36)',
        boxShadow: isLight
          ? 'inset 0 0 18px rgba(45,212,160,0.1), 0 0 20px rgba(45,212,160,0.18)'
          : 'inset 0 0 18px rgba(0,200,255,0.1), 0 0 24px rgba(0,200,255,0.2)',
      },
    },
    '@media (prefers-reduced-motion: reduce)': {
      willChange: 'auto',
      transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background-color 160ms ease',
      '& .pulse-icon': {
        willChange: 'auto',
        transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background-color 160ms ease',
      },
      '&:hover': {
        transform: 'translate3d(0, -4px, 0)',
      },
      '&:hover .pulse-icon': {
        transform: 'translate3d(0, 0, 0) scale(1.02)',
      },
    },
  }

  const benefitsCardSx = {
    ...cardSx,
    border: isLight ? '1px solid rgba(45,212,160,0.16)' : cardSx.border,
    background: isLight ? 'linear-gradient(180deg, #ffffff 0%, #f7fffb 100%)' : cardSx.background,
    boxShadow: isLight ? '0 18px 44px rgba(15,23,42,0.08)' : cardSx.boxShadow,
    isolation: 'isolate',
    transition: 'transform .38s ease, border-color .38s ease, box-shadow .38s ease, background .38s ease',
    '& > *': {
      position: 'relative',
      zIndex: 1,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: 'inherit',
      padding: '1px',
      background: isLight
        ? 'linear-gradient(120deg, transparent 0%, rgba(45,212,160,0.05) 34%, rgba(45,212,160,0.55) 49%, rgba(0,184,232,0.24) 55%, transparent 70%)'
        : 'linear-gradient(120deg, transparent 0%, rgba(0,200,255,0.05) 32%, rgba(0,200,255,0.58) 48%, rgba(45,212,160,0.35) 58%, transparent 72%)',
      WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      opacity: 0.32,
      pointerEvents: 'none',
      transform: 'translateX(-125%)',
      animation: 'benefitBorderSweep 5.4s ease-in-out infinite',
      zIndex: 0,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 1,
      borderRadius: 'inherit',
      background: isLight
        ? 'radial-gradient(circle at 25% 0%, rgba(45,212,160,0.08), transparent 38%)'
        : 'radial-gradient(circle at 25% 0%, rgba(0,200,255,0.12), transparent 38%)',
      opacity: 0,
      transition: 'opacity .38s ease',
      pointerEvents: 'none',
      zIndex: 0,
    },
    '&:hover': {
      ...cardSx['&:hover'],
      borderColor: isLight ? 'rgba(45,212,160,0.42)' : 'rgba(0,200,255,0.52)',
      background: isLight
        ? 'radial-gradient(circle at 18% 0%, rgba(45,212,160,0.12), transparent 36%), linear-gradient(180deg, #ffffff 0%, #f3fff9 100%)'
        : 'radial-gradient(circle at 18% 0%, rgba(0,200,255,0.16), transparent 36%), linear-gradient(145deg, rgba(7, 29, 47, 0.92), rgba(3, 10, 18, 0.86))',
      boxShadow: isLight
        ? '0 26px 70px rgba(8,164,88,0.16), 0 12px 30px rgba(15,23,42,0.08)'
        : '0 30px 90px rgba(0, 200, 255, 0.16), inset 0 0 42px rgba(45, 212, 160, 0.08)',
      '&::before': {
        opacity: 0.78,
        animationDuration: '3.2s',
      },
      '&::after': {
        opacity: 1,
      },
      '.benefit-icon-wrap': {
        transform: 'translateY(-4px) scale(1.04)',
        borderColor: isLight ? 'rgba(45,212,160,0.34)' : 'rgba(0,200,255,0.36)',
        boxShadow: isLight
          ? '0 18px 42px rgba(45,212,160,0.18), inset 0 0 18px rgba(45,212,160,0.12)'
          : '0 18px 44px rgba(0,200,255,0.18), inset 0 0 18px rgba(45,212,160,0.10)',
      },
      '.benefit-bullet': {
        transform: 'translateX(4px)',
      },
      '.benefit-check': {
        filter: isLight ? 'drop-shadow(0 0 7px rgba(45,212,160,0.36))' : 'drop-shadow(0 0 8px rgba(0,200,255,0.42))',
        transform: 'scale(1.08)',
      },
      '.benefit-bullet-text': {
        color: isLight ? 'rgba(20,33,45,0.82)' : 'rgba(242,249,252,0.86)',
      },
      '.benefit-title': {
        color: isLight ? 'rgba(7,26,18,0.96)' : '#ffffff',
        textShadow: isLight ? '0 0 0 rgba(45,212,160,0)' : '0 0 16px rgba(0,200,255,0.16)',
      },
    },
  }

  const metricsCardSx = {
    ...benefitsCardSx,
    transform: 'translate3d(0, 0, 0)',
    willChange: 'transform, box-shadow',
    backfaceVisibility: 'hidden',
    transition: premiumHoverTransition,
    '&:hover': {
      transform: 'translate3d(0, -4px, 0)',
      borderColor: isLight ? 'rgba(45,212,160,0.42)' : 'rgba(0, 200, 255, 0.46)',
      boxShadow: isLight
        ? '0 20px 40px rgba(16,24,40,0.06), 0 12px 30px rgba(8,164,88,0.08)'
        : '0 30px 90px rgba(0, 200, 255, 0.12), inset 0 0 42px rgba(0, 200, 255, 0.08)',
      '&::before': {
        opacity: 0.62,
        animationDuration: '3.2s',
      },
      '&::after': {
        opacity: 1,
      },
    },
    '@media (prefers-reduced-motion: reduce)': {
      willChange: 'auto',
      transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease, background-color 160ms ease',
      '&:hover': {
        transform: 'translate3d(0, -4px, 0)',
      },
    },
  }

  const fairBannerSx = {
    ...cardSx,
    width: 'min(1080px, calc(100% - 32px))',
    mx: 'auto',
    py: { xs: 4.5, md: 6 },
    px: 3,
    textAlign: 'center' as const,
    border: isLight ? '1px solid rgba(45,212,160,0.2)' : cardSx.border,
    background: isLight ? 'linear-gradient(180deg, #ffffff 0%, #f4fff9 100%)' : cardSx.background,
    boxShadow: isLight ? '0 20px 54px rgba(15,23,42,0.08)' : cardSx.boxShadow,
    '&:hover': {
      ...cardSx['&:hover'],
      borderColor: isLight ? 'rgba(45,212,160,0.32)' : cardSx['&:hover'].borderColor,
      boxShadow: isLight ? '0 26px 70px rgba(15,23,42,0.1)' : cardSx['&:hover'].boxShadow,
    },
  }

  useEffect(() => {
    const root = document.documentElement
    const obs = new MutationObserver(() => {
      setColorScheme(root.getAttribute('data-toolpad-color-scheme') || 'light')
    })
    obs.observe(root, { attributes: true, attributeFilter: ['data-toolpad-color-scheme'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    // initialize from localStorage if available
    try {
      const stored = localStorage.getItem('borali-color-scheme')
      if (stored) {
        document.documentElement.setAttribute('data-toolpad-color-scheme', stored)
        setColorScheme(stored)
      }
    } catch (e) {
      /* ignore */
    }
  }, [])

  const toggleColorScheme = () => {
    try {
      const next = colorScheme === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-toolpad-color-scheme', next)
      localStorage.setItem('borali-color-scheme', next)
      setColorScheme(next)
    } catch (e) {
      /* ignore */
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        color: '#f4f8fb',
        bgcolor: '#02070d',
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 50% 0%, rgba(0, 200, 255, 0.14), transparent 30%), linear-gradient(180deg, #02070d 0%, #030b13 42%, #02070d 100%)',
        '@keyframes fadeUp': {
          from: { opacity: 0, transform: 'translateY(22px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        '@keyframes floatSoft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        '@keyframes pulseGlow': {
          '0%, 100%': { boxShadow: '0 0 18px var(--accent-glow), inset 0 0 18px var(--accent-soft)' },
          '50%': { boxShadow: '0 0 34px var(--accent-glow), inset 0 0 24px var(--accent-soft)' },
        },
        '@keyframes routeShimmer': {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '35%, 65%': { opacity: 0.75 },
          '100%': { transform: 'translateX(100%)', opacity: 0 },
        },
        '@keyframes carToDestination': {
          '0%': { left: 8, transform: 'translateY(-50%) rotate(90deg)' },
          '44%': { left: 'calc(100% - 30px)', transform: 'translateY(-50%) rotate(90deg)' },
          '48%': { left: 'calc(100% - 30px)', transform: 'translateY(-50%) rotate(180deg)' },
          '52%': { left: 'calc(100% - 30px)', transform: 'translateY(-50%) rotate(270deg)' },
          '96%': { left: 8, transform: 'translateY(-50%) rotate(270deg)' },
          '100%': { left: 8, transform: 'translateY(-50%) rotate(90deg)' },
        },
        '@keyframes trackingCarFloat': {
          '0%': { left: '21.9%', top: '73.4%', transform: 'translate(-50%, -50%) rotate(62deg)' },
          '24%': { left: '54%', top: '47%', transform: 'translate(-50%, -50%) rotate(62deg)' },
          '44%': { left: '81.9%', top: '15.2%', transform: 'translate(-50%, -50%) rotate(62deg)' },
          '48%': { left: '81.9%', top: '15.2%', transform: 'translate(-50%, -50%) rotate(152deg)' },
          '52%': { left: '81.9%', top: '15.2%', transform: 'translate(-50%, -50%) rotate(242deg)' },
          '76%': { left: '54%', top: '47%', transform: 'translate(-50%, -50%) rotate(242deg)' },
          '96%': { left: '21.9%', top: '73.4%', transform: 'translate(-50%, -50%) rotate(242deg)' },
          '100%': { left: '21.9%', top: '73.4%', transform: 'translate(-50%, -50%) rotate(62deg)' },
        },
        '@keyframes benefitBorderSweep': {
          '0%': { transform: 'translateX(-125%)' },
          '42%, 100%': { transform: 'translateX(125%)' },
        },
        '@keyframes benefitIconBounce': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '45%': { transform: 'translateY(-4px) scale(1.13)' },
          '72%': { transform: 'translateY(1px) scale(0.98)' },
        },
        '@keyframes benefitIconGlow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 0 transparent)', transform: 'scale(1)' },
          '52%': { filter: 'drop-shadow(0 0 12px var(--accent-glow))', transform: 'scale(1.1)' },
        },
        '@keyframes benefitIconShield': {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '42%': { transform: 'rotate(-7deg) scale(1.08)' },
          '72%': { transform: 'rotate(5deg) scale(1.03)' },
        },
        '@keyframes benefitIconStar': {
          '0%, 100%': { filter: 'drop-shadow(0 0 0 transparent)', transform: 'scale(1)' },
          '46%': { filter: 'drop-shadow(0 0 13px var(--accent-glow))', transform: 'scale(1.16)' },
          '72%': { transform: 'scale(1.04)' },
        },
        '@keyframes dreamOrbMove': {
          '0%': {
            left: '0%',
            opacity: 0,
            transform: 'translate(-50%, -50%) scale(0.75)',
          },
          '8%': {
            opacity: 1,
          },
          '25%': {
            left: '25%',
            transform: 'translate(-50%, -50%) scale(1)',
          },
          '50%': {
            left: '50%',
            transform: 'translate(-50%, -50%) scale(0.92)',
          },
          '75%': {
            left: '75%',
            transform: 'translate(-50%, -50%) scale(1.05)',
          },
          '92%': {
            opacity: 1,
          },
          '100%': {
            left: '100%',
            opacity: 0,
            transform: 'translate(-50%, -50%) scale(0.75)',
          },
        },
        '@keyframes resourceIconDream': {
          '0%, 9%, 100%': {
            transform: 'scale(1)',
            boxShadow: 'inset 0 0 18px var(--accent-soft), 0 0 14px var(--accent-glow)',
          },
          '4.5%': {
            transform: 'scale(1.08)',
            boxShadow: isLight
              ? 'inset 0 0 18px rgba(45,212,160,0.12), 0 0 22px rgba(45,212,160,0.26)'
              : 'inset 0 0 20px rgba(0,200,255,0.16), 0 0 26px rgba(0,200,255,0.30), 0 0 36px rgba(53,214,246,0.14)',
          },
        },
        '@keyframes resourceRipple': {
          '0%, 8%, 100%': { opacity: 0, transform: 'translate(-50%, -50%) scale(0.82)' },
          '4.5%': { opacity: isLight ? 0.34 : 0.42, transform: 'translate(-50%, -50%) scale(1.34)' },
        },
        '.fade-up': { animation: 'fadeUp .78s ease both' },
        '.float-soft': { animation: 'floatSoft 5.5s ease-in-out infinite' },
        '.pulse-icon': { animation: 'pulseGlow 3s ease-in-out infinite' },
        '.stats-content': {
          position: 'relative',
          zIndex: 1,
        },
        '.stats-grid': {
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
          gap: { xs: 2.5, md: 3 },
          background: 'transparent',
          boxShadow: 'none',
          border: 'none',
        },
        '.number': {
          position: 'relative',
          width: 'auto',
          maxWidth: '100%',
          minHeight: 48,
          overflow: 'hidden',
          transition: 'text-shadow .28s ease',
        },
        '.stat-label': {
          minHeight: 20,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        '.stat-caption': {
          minHeight: 36,
          width: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        },
        '.dream-line': {
          position: 'absolute',
          left: '8.5%',
          right: '8.5%',
          top: 34,
          height: 2,
          width: 'auto',
          pointerEvents: 'none',
          zIndex: 0,
          display: 'none',
          overflow: 'visible',
        },
        '.dream-line::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 999,
          background: isLight
            ? 'linear-gradient(90deg, rgba(45,212,160,0), rgba(45,212,160,0.18), rgba(45,212,160,0))'
            : 'linear-gradient(90deg, rgba(0,200,255,0), rgba(0,200,255,0.22), rgba(53,214,246,0.16), rgba(0,200,255,0))',
          boxShadow: isLight ? '0 0 10px rgba(45,212,160,0.08)' : '0 0 14px rgba(0,200,255,0.14)',
        },
        '.dream-orb': {
          position: 'absolute',
          left: 0,
          top: '50%',
          width: 14,
          height: 14,
          transform: 'translate(-50%, -50%) scale(0.75)',
          borderRadius: 999,
          background: isLight
            ? 'radial-gradient(circle, #ffffff 0%, #8effd9 28%, rgba(45,212,160,0.42) 66%, transparent 100%)'
            : 'radial-gradient(circle, #ffffff 0%, #9eefff 26%, rgba(0,200,255,0.44) 66%, transparent 100%)',
          boxShadow: isLight
            ? '0 0 14px rgba(45,212,160,0.62), 0 0 30px rgba(8,164,88,0.20)'
            : '0 0 18px rgba(0,200,255,0.74), 0 0 38px rgba(53,214,246,0.24)',
          animation: 'dreamOrbMove 6.4s ease-in-out infinite',
          willChange: 'left, opacity, transform',
        },
        '.dream-orb::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          right: 6,
          width: 92,
          height: 2,
          transform: 'translateY(-50%)',
          borderRadius: 999,
          background: isLight
            ? 'linear-gradient(90deg, transparent, rgba(45,212,160,0.54), rgba(45,212,160,0.10))'
            : 'linear-gradient(90deg, transparent, rgba(0,200,255,0.46), rgba(53,214,246,0.22), transparent)',
          filter: 'blur(1px)',
          opacity: isLight ? 0.72 : 0.86,
        },
        '.resource-item': {
          position: 'relative',
          zIndex: 1,
          borderRadius: 4,
          transition: 'transform .32s ease, background .32s ease, box-shadow .32s ease',
          animationDelay: 'calc(var(--resource-index) * 95ms)',
        },
        '.resource-icon': {
          position: 'relative',
          width: 44,
          height: 44,
          display: 'grid',
          placeItems: 'center',
        },
        '.resource-icon::after': {
          content: '""',
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: isLight ? '1px solid rgba(45,212,160,0.22)' : '1px solid rgba(0,200,255,0.28)',
          boxShadow: isLight ? '0 0 18px rgba(45,212,160,0.12)' : '0 0 22px rgba(0,200,255,0.16)',
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(0.82)',
          animation: 'resourceRipple 6.6s ease-in-out infinite',
          animationDelay: 'calc(var(--resource-index) * 1.32s)',
          pointerEvents: 'none',
        },
        '.resource-icon .pulse-icon': {
          animation: 'resourceIconDream 6.6s ease-in-out infinite',
          animationDelay: 'calc(var(--resource-index) * 1.32s)',
          transition: 'transform .32s ease, box-shadow .32s ease, background .32s ease, border-color .32s ease',
        },
        '.resource-item:hover': {
          transform: 'translateY(-5px)',
          background: isLight ? 'rgba(255,255,255,0.58)' : 'rgba(0,200,255,0.045)',
          boxShadow: isLight ? '0 16px 34px rgba(8,164,88,0.10)' : '0 18px 42px rgba(0,200,255,0.10)',
        },
        '.resource-item:hover .pulse-icon': {
          transform: 'scale(1.08)',
          borderColor: isLight ? 'rgba(45,212,160,0.36)' : 'rgba(0,200,255,0.42)',
          boxShadow: isLight
            ? 'inset 0 0 18px rgba(45,212,160,0.12), 0 0 24px rgba(45,212,160,0.22)'
            : 'inset 0 0 20px rgba(0,200,255,0.12), 0 0 28px rgba(0,200,255,0.24)',
        },
        '.resource-item:hover .resource-title': {
          color: isLight ? 'rgba(9,28,20,0.96)' : '#ffffff',
          textShadow: isLight ? 'none' : '0 0 14px rgba(0,200,255,0.14)',
        },
        '@media (min-width: 1200px)': {
          '.dream-line': {
            display: 'block',
          },
        },
        '@media (prefers-reduced-motion: reduce)': {
          '.fade-up, .float-soft, .pulse-icon, .dream-orb, .resource-icon::after': {
            animation: 'none',
          },
          '.benefit-card::before, .benefit-card .benefit-icon-symbol, .resource-icon .pulse-icon': {
            animation: 'none !important',
          },
          '.benefit-card, .benefit-card::after, .benefit-icon-wrap, .benefit-bullet, .benefit-check, .benefit-bullet-text, .resource-item, .resource-icon .pulse-icon': {
            transitionDuration: '0.01ms !important',
          },
        },
      }}
    >
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          borderBottom: isLight ? '1px solid rgba(16, 24, 40, 0.08)' : '1px solid rgba(0, 200, 255, 0.1)',
          bgcolor: isLight ? 'rgba(255, 255, 255, 0.94)' : 'rgba(2, 7, 13, 0.76)',
          backdropFilter: 'blur(18px)',
          boxShadow: isLight ? '0 1px 0 rgba(16, 24, 40, 0.02)' : 'none',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: pageWidth, mx: 'auto', py: 1.7 }}
        >
          <Box component="img" src={logo} alt="BorAli" sx={{ width: { xs: 106, md: 128 }, objectFit: 'contain' }} />
          <Stack direction="row" spacing={3.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navLinks.map((item) => (
              <Typography
                key={item}
                component="a"
                href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                sx={{
                  color: isLight ? 'rgba(31, 41, 55, 0.78)' : 'rgba(244,248,251,0.72)',
                  fontSize: 14,
                  fontWeight: isLight ? 700 : 400,
                  textDecoration: 'none',
                  '&:hover': { color: isLight ? 'var(--color-accent)' : '#16d9ff' },
                }}
              >
                {item}
              </Typography>
            ))}
          </Stack>
          <Stack direction="row" spacing={1.6} alignItems="center">
            <Tooltip title="Alternar tema">
              <IconButton
                onClick={toggleColorScheme}
                sx={{
                  color: isLight ? 'rgba(31,41,55,0.82)' : '#fff',
                  display: 'inline-flex',
                  flexShrink: 0,
                  border: isLight ? '1px solid rgba(16,24,40,0.10)' : '1px solid rgba(255,255,255,0.18)',
                  bgcolor: isLight ? 'rgba(255,255,255,0.86)' : 'rgba(255,255,255,0.08)',
                  '&:hover': {
                    bgcolor: isLight ? 'rgba(45,212,160,0.08)' : 'rgba(0,200,255,0.12)',
                  },
                }}
                aria-label="toggle theme"
              >
                {colorScheme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              color="secondary"
              onClick={goToLogin}
              sx={{
                px: { xs: 1.8, md: 2.8 },
                minHeight: 42,
                fontWeight: 900,
                color: '#fff',
                bgcolor: isLight ? 'var(--color-accent)' : undefined,
                boxShadow: isLight ? '0 10px 22px rgba(45, 212, 160, 0.18)' : '0 0 26px rgba(0, 200, 255, 0.28)',
                '&:hover': {
                  bgcolor: isLight ? '#158765' : undefined,
                  boxShadow: isLight ? '0 14px 30px rgba(45, 212, 160, 0.22)' : '0 0 30px rgba(0, 200, 255, 0.34)',
                },
              }}
            >
              Acessar Admin
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box
        component="main"
        sx={{
          position: 'relative',
          '& section': { position: 'relative', zIndex: 1 },
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(180deg, rgba(2,7,13,0.08), #02070d 92%), url(${loginMapBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'top center',
            opacity: 0.2,
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          component="section"
          sx={{
            minHeight: { xs: 'auto', md: '94vh' },
            pt: { xs: 14, md: 18 },
            pb: { xs: 9, md: 12 },
            display: 'grid',
            alignItems: 'center',
            overflow: 'hidden',
            background: isLight ? 'linear-gradient(180deg, #ffffff 0%, #f7fffb 100%)' : 'transparent',
            '&::before': isLight
              ? {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'linear-gradient(120deg, transparent 0 58%, rgba(45,212,160,0.08) 58.1%, transparent 58.4%), linear-gradient(rgba(45,212,160,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(45,212,160,0.04) 1px, transparent 1px), radial-gradient(circle, rgba(45,212,160,0.18) 1px, transparent 1.5px)',
                  backgroundSize: '100% 100%, 46px 46px, 46px 46px, 72px 72px',
                  opacity: 0.7,
                  pointerEvents: 'none',
                }
              : undefined,
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, width: pageWidth, mx: 'auto', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.05fr .95fr' }, gap: { xs: 5, md: 8 }, alignItems: 'center' }}>
            <Stack spacing={3.2} className="fade-up">
              <Box sx={{ width: 98, height: 5, borderRadius: 999, background: isLight ? 'linear-gradient(90deg, var(--color-accent), transparent)' : 'linear-gradient(90deg, #00c8ff, transparent)' }} />
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: 42, sm: 58, md: 76 },
                  lineHeight: 0.98,
                  fontWeight: 950,
                  letterSpacing: 0,
                  color: isLight ? 'var(--text-primary)' : '#fff',
                  textShadow: isLight ? 'none' : '0 0 42px rgba(0, 200, 255, 0.22)',
                }}
              >
                Mobilidade justa
                <Box component="span" sx={{ display: 'block', color: isLight ? 'var(--color-accent)' : '#00c8ff' }}>
                  para todos.
                </Box>
              </Typography>
              <Typography sx={{ maxWidth: 660, color: isLight ? 'rgba(31, 41, 55, 0.78)' : 'rgba(230, 241, 248, 0.78)', fontSize: { xs: 16, md: 19 }, lineHeight: 1.75 }}>
                A{' '}
                <Box component="span" sx={{ color: isLight ? 'var(--color-accent)' : '#00c8ff', fontWeight: 700 }}>
                  BorAli
                </Box>{' '}
                conecta passageiros e motoristas em uma experiência mais justa: viagens com segurança, preço transparente e motoristas pagando por mensalidade, não por km rodado.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  size="large"
                  variant="contained"
                  color="secondary"
                  endIcon={<ArrowForwardIcon />}
                  onClick={goToLogin}
                  sx={{
                    minHeight: 52,
                    px: 3.4,
                    fontWeight: 900,
                    color: '#fff',
                    bgcolor: isLight ? 'var(--color-accent)' : undefined,
                    boxShadow: isLight ? '0 14px 30px rgba(45, 212, 160, 0.2)' : '0 0 34px rgba(0, 200, 255, 0.32)',
                    '&:hover': {
                      bgcolor: isLight ? '#158765' : undefined,
                      boxShadow: isLight ? '0 18px 38px rgba(45, 212, 160, 0.24)' : '0 0 38px rgba(0, 200, 255, 0.38)',
                    },
                  }}
                >
                  Começar agora
                </Button>
                <Button
                  size="large"
                  variant="outlined"
                  href="#nossos-beneficios"
                  sx={{
                    minHeight: 52,
                    px: 3.4,
                    color: isLight ? 'var(--text-primary)' : '#f4f8fb',
                    borderColor: isLight ? 'rgba(29, 175, 130, 0.48)' : 'rgba(0, 200, 255, 0.36)',
                    bgcolor: isLight ? '#fff' : 'transparent',
                    fontWeight: 900,
                    '&:hover': {
                      borderColor: isLight ? 'var(--color-accent)' : '#16d9ff',
                      bgcolor: isLight ? 'rgba(45, 212, 160, 0.07)' : 'rgba(0, 200, 255, 0.06)',
                    },
                  }}
                >
                  Conhecer a BorAli
                </Button>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                {['Motorista verificado', 'Preço transparente', 'Rota segura'].map((item) => (
                  <Stack key={item} direction="row" spacing={1} alignItems="center" sx={{ width: 'fit-content', px: 1.6, py: 1, borderRadius: 999, border: isLight ? '1px solid rgba(8, 164, 88, 0.18)' : '1px solid rgba(0, 200, 255, 0.18)', bgcolor: isLight ? 'rgba(255, 255, 255, 0.84)' : 'rgba(6, 24, 40, 0.72)', boxShadow: isLight ? '0 8px 22px rgba(16,24,40,0.04)' : 'none' }}>
                    <CheckIcon sx={{ color: isLight ? 'var(--color-accent)' : '#16d9ff', fontSize: 16 }} />
                    <Typography sx={{ color: isLight ? 'rgba(31,41,55,0.78)' : 'rgba(244,248,251,0.82)', fontSize: 13, fontWeight: 700 }}>{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>

            <Box
              className="float-soft"
              sx={{
                ...cardSx,
                minHeight: { xs: 420, md: 560 },
                p: { xs: 3, md: 4 },
                display: { xs: 'none', sm: 'block' },
                border: isLight ? '1px solid rgba(45, 212, 160, 0.14)' : cardSx.border,
                background: isLight ? '#fff' : cardSx.background,
                boxShadow: isLight ? '0 24px 70px rgba(16, 24, 40, 0.1)' : cardSx.boxShadow,
                '&:hover': {
                  ...cardSx['&:hover'],
                  borderColor: isLight ? 'rgba(45, 212, 160, 0.24)' : cardSx['&:hover'].borderColor,
                  boxShadow: isLight ? '0 30px 86px rgba(16, 24, 40, 0.12)' : cardSx['&:hover'].boxShadow,
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: isLight
                    ? `linear-gradient(180deg, rgba(255,255,255,0.86), rgba(247,255,251,0.94)), url(${loginMapBg})`
                    : `linear-gradient(180deg, rgba(2,7,13,0.2), rgba(2,7,13,0.95)), url(${loginMapBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: isLight ? 0.66 : 0.74,
                }}
              />
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box component="img" src={logo} alt="BorAli" sx={{ width: 120 }} />
                  <GlassIcon icon={SecurityIcon} />
                </Stack>
                <MiniMap secure />
                <Stack spacing={1.4} sx={{ mt: 3 }}>
                  {[
                    ['Tarifa estimada', 'R$ 18,90'],
                    ['Motorista parceiro', 'João Silva'],
                    ['Chegada', '4 min'],
                  ].map(([label, value]) => (
                    <Stack
                      key={label}
                      direction="row"
                      justifyContent="space-between"
                      sx={{
                        p: 1.6,
                        borderRadius: 3,
                        bgcolor: isLight ? 'rgba(255, 255, 255, 0.88)' : 'rgba(0, 8, 14, 0.58)',
                        border: isLight ? '1px solid rgba(16, 24, 40, 0.07)' : '1px solid rgba(0, 200, 255, 0.12)',
                        boxShadow: isLight ? '0 8px 22px rgba(16, 24, 40, 0.04)' : 'none',
                      }}
                    >
                      <Typography sx={{ color: isLight ? 'var(--text-secondary)' : 'rgba(230,241,248,0.62)', fontSize: 13 }}>{label}</Typography>
                      <Typography sx={{ color: isLight ? 'var(--text-primary)' : '#f7fbff', fontSize: 13, fontWeight: 900 }}>{value}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box component="section" id="nossos-beneficios" sx={{ py: { xs: 7, md: 9 } }}>
          <Box sx={{ width: pageWidth, mx: 'auto', background: colorScheme === 'light' ? 'var(--bg-primary)' : 'transparent', borderRadius: colorScheme === 'light' ? 4 : 0, py: { xs: 4, md: 6 }, px: { xs: 0, md: 0 } }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
              <Typography sx={{ color: colorScheme === 'light' ? 'var(--text-primary)' : '#fff', fontSize: { xs: 24, md: 30 }, fontWeight: 900 }}>
                Nossos benefícios
              </Typography>
              <Box sx={{ width: 68, height: 3, borderRadius: 999, bgcolor: 'var(--color-primary)', mx: 'auto', mt: 2, boxShadow: colorScheme === 'light' ? '0 0 18px rgba(45,212,160,0.12)' : 'none' }} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: { xs: 2.5, md: 3 }, px: { xs: 0, md: 0 } }}>
              {benefits.map((benefit, index) => (
                <Stack
                  key={benefit.title}
                  className={`fade-up benefit-card benefit-card-${index}`}
                  sx={{
                    ...solutionCardVisualSx,
                    animationDelay: `${index * 110}ms`,
                  }}
                >
                  <GlassIcon icon={benefit.icon} />
                  <Typography className="benefit-title" sx={{ mt: 3, color: colorScheme === 'light' ? 'var(--text-primary)' : '#fff', fontSize: 21, fontWeight: 950 }}>
                    {benefit.title}
                  </Typography>
                  <Typography sx={{ mt: 1.2, color: colorScheme === 'light' ? 'var(--text-secondary)' : 'rgba(230,241,248,0.78)', fontSize: 14.5, lineHeight: 1.65 }}>
                    {benefit.description}
                  </Typography>
                  <Box sx={{ mt: 2.2 }}>
                    <Bullets items={benefit.bullets} />
                  </Box>
                </Stack>
              ))}
            </Box>
          </Box>
        </Box>

        <Box component="section" sx={{ py: { xs: 3, md: 4 }, background: colorScheme === 'light' ? 'var(--bg-primary)' : 'transparent' }}>
          <Stack alignItems="center" spacing={1.8} sx={fairBannerSx}>
            <Box
              sx={{
                width: 56,
                height: 56,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '50%',
                bgcolor: 'rgba(45,212,160,0.12)',
                color: 'var(--color-primary)',
                border: '1px solid rgba(45,212,160,0.18)',
                mb: 2,
              }}
            >
              <VerifiedUserIcon sx={{ fontSize: 26 }} />
            </Box>
            <Typography sx={{ color: colorScheme === 'light' ? 'var(--text-primary)' : '#fff', fontSize: { xs: 24, md: 32 }, fontWeight: 950, maxWidth: 860 }}>
              Mobilidade justa para motoristas e passageiros.
            </Typography>
            <Typography sx={{ color: colorScheme === 'light' ? 'var(--text-secondary)' : 'rgba(230,241,248,0.75)', fontSize: 15, maxWidth: 780, lineHeight: 1.8 }}>
              Mais que uma plataforma, um novo jeito de se mover.
            </Typography>
          </Stack>
        </Box>

        <Box component="section" id="passageiros" sx={{ py: { xs: 8, md: 10 }, background: isLight ? 'linear-gradient(180deg, #ffffff 0%, #f7fffb 100%)' : 'transparent' }}>
            <Box sx={{ width: pageWidth, mx: 'auto' }}>
            <SectionTitle sx={{ color: colorScheme === 'light' ? 'var(--text-primary)' : undefined }}>{'Soluções para cada necessidade'}</SectionTitle>
            <Box className="solutions-section" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 2.8 }}>
              {solutions.map((solution) => (
                <Stack
                  key={solution.title}
                  sx={{
                    ...(colorScheme === 'light'
                      ? {
                          background: 'var(--bg-card)',
                          border: '1px solid var(--borders)',
                          boxShadow: 'var(--shadows)',
                          p: 3,
                          minHeight: 300,
                          borderRadius: 4,
                          transition: 'transform .18s ease, box-shadow .18s ease, border-color .18s ease',
                          '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(16,24,40,0.06)', borderColor: 'var(--color-primary)' },
                        }
                      : { ...cardSx, p: 3, minHeight: 300 }),
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <GlassIcon icon={solution.icon} />
                  <Typography sx={{ ...(solution.visual === 'passenger' || solution.visual === 'driver' ? { position: 'relative', zIndex: 2, maxWidth: { xs: '68%', sm: '62%' } } : {}), mt: 3, color: colorScheme === 'light' ? 'var(--text-primary)' : '#fff', fontSize: 21, fontWeight: 950 }}>{solution.title}</Typography>
                  <Typography sx={{ ...(solution.visual === 'passenger' || solution.visual === 'driver' ? { position: 'relative', zIndex: 2, maxWidth: { xs: '66%', sm: '58%' } } : { maxWidth: 260 }), mt: 1.2, color: colorScheme === 'light' ? 'var(--text-secondary)' : 'rgba(230,241,248,0.78)', fontSize: 14.5, lineHeight: 1.65 }}>{solution.text}</Typography>
                  <Box sx={{ ...(solution.visual === 'passenger' || solution.visual === 'driver' ? { position: 'relative', zIndex: 2, maxWidth: { xs: '66%', sm: '58%' } } : { maxWidth: 260 }), mt: 2.2 }}>
                    <Bullets items={solution.bullets} />
                  </Box>
                  <Button
                    endIcon={<ArrowForwardIcon />}
                    sx={{ ...(solution.visual === 'passenger' || solution.visual === 'driver' ? { position: 'relative', zIndex: 2 } : {}), mt: 2.5, p: 0, justifyContent: 'flex-start', color: colorScheme === 'light' ? 'var(--color-primary)' : '#16d9ff', fontWeight: 900, width: 'fit-content', '& svg': { transition: 'transform .18s ease' }, '&:hover svg': { transform: 'translateX(6px)' } }}
                  >
                    Saiba mais
                  </Button>

                  {solution.visual === 'dashboard' ? (
                    <Box sx={{ position: 'absolute', right: -18, bottom: 24, width: 220, height: 154, opacity: colorScheme === 'light' ? 0.9 : 0.55, borderRadius: 3, border: '1px solid var(--borders)', background: colorScheme === 'light' ? 'linear-gradient(145deg, rgba(45,212,160,0.06), rgba(255,255,255,0.6))' : 'linear-gradient(145deg, rgba(0,200,255,0.12), rgba(2,7,13,0.4))' }}>
                      <Box sx={{ position: 'absolute', right: 26, top: 28, width: 76, height: 76, borderRadius: '50%', border: colorScheme === 'light' ? '10px solid rgba(45,212,160,0.12)' : '10px solid rgba(0,200,255,0.36)', borderLeftColor: 'rgba(255,255,255,0.08)' }} />
                      {[20, 48, 76, 104].map((top) => (
                        <Box key={top} sx={{ position: 'absolute', left: 20, top, width: 80 + top / 3, height: 8, borderRadius: 999, bgcolor: colorScheme === 'light' ? 'rgba(45,212,160,0.08)' : 'rgba(0,200,255,0.18)' }} />
                      ))}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        position: 'absolute',
                        right:
                          solution.visual === 'passenger'
                            ? { xs: -6, sm: -10 }
                            : solution.visual === 'driver'
                              ? { xs: -6, sm: -14 }
                              : { xs: -28, sm: 2 },
                        bottom: solution.visual === 'passenger' || solution.visual === 'driver' ? { xs: -4, sm: -8 } : -8,
                        width:
                          solution.visual === 'passenger'
                            ? { xs: 148, sm: 188, md: 218 }
                            : solution.visual === 'driver'
                              ? { xs: 154, sm: 194, md: 226 }
                              : 150,
                        height: solution.visual === 'passenger' || solution.visual === 'driver' ? { xs: 168, sm: 208, md: 228 } : 220,
                        opacity: { xs: 0.24, sm: solution.visual === 'passenger' || solution.visual === 'driver' ? 1 : colorScheme === 'light' ? 0.9 : 0.72 },
                        pointerEvents: 'none',
                        zIndex: 1,
                      }}
                    >
                      {solution.visual === 'passenger' ? (
                        <Box
                          component="img"
                          src={colorScheme === 'light' ? passengerLocationGreen : passengerLocationBlue}
                          alt="Passageira usando localização no celular"
                          className="solution-illustration passenger-illustration"
                          sx={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            width: '100%',
                            height: 'auto',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            objectPosition: 'right bottom',
                            filter: colorScheme === 'light' ? 'drop-shadow(0 10px 24px rgba(16,24,40,0.08))' : 'drop-shadow(0 18px 28px rgba(0,200,255,0.18))',
                            transform: 'scale(1.04)',
                            transformOrigin: 'right bottom',
                            userSelect: 'none',
                          }}
                        />
                      ) : solution.visual === 'driver' ? (
                        <Box
                          component="img"
                          src={colorScheme === 'light' ? driverGpsNavigatorGreen : driverGpsNavigatorBlue}
                          alt="Motorista usando navegador GPS"
                          className="solution-illustration driver-illustration"
                          sx={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0,
                            width: '100%',
                            height: 'auto',
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            objectPosition: 'right bottom',
                            filter: colorScheme === 'light' ? 'drop-shadow(0 10px 24px rgba(16,24,40,0.08))' : 'drop-shadow(0 18px 28px rgba(0,200,255,0.18))',
                            transform: 'scale(1.08)',
                            transformOrigin: 'right bottom',
                            userSelect: 'none',
                          }}
                        />
                      ) : (
                        <>
                          <Box sx={{ position: 'absolute', left: 34, top: 18, width: 74, height: 74, borderRadius: '50%', background: colorScheme === 'light' ? 'linear-gradient(135deg, #fff, rgba(45,212,160,0.12))' : 'linear-gradient(135deg, #f7fbff, #16d9ff)' }} />
                          <Box sx={{ position: 'absolute', left: 18, top: 88, width: 112, height: 150, borderRadius: '56px 56px 18px 18px', background: colorScheme === 'light' ? (solution.visual === 'driver' ? 'linear-gradient(180deg, rgba(45,212,160,0.12), rgba(255,255,255,0.6))' : 'linear-gradient(180deg, rgba(240,245,243,0.8), rgba(230,240,236,0.6))') : (solution.visual === 'driver' ? 'linear-gradient(180deg, #0e3850, #061521)' : 'linear-gradient(180deg, #d6e3e8, #5e7884)'), boxShadow: colorScheme === 'light' ? '0 10px 30px rgba(16,24,40,0.04)' : '0 0 38px rgba(0,200,255,0.16)' }} />
                        </>
                      )}
                    </Box>
                  )}
                </Stack>
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          component="section"
          id="motoristas"
          sx={{
            py: { xs: 7, md: 10 },
            background: colorScheme === 'light' ? 'var(--bg-primary)' : 'transparent',
          }}
        >
          <Box sx={{ width: pageWidth, mx: 'auto' }}>
            <SectionTitle sx={{ color: colorScheme === 'light' ? 'var(--text-primary)' : undefined }}>Como funciona</SectionTitle>
            <Box
              sx={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' },
                gap: 2.4,
              }}
            >
              {[
                { number: '01', icon: PlaceIcon, title: 'Informe sua rota', description: 'Escolha origem e destino de forma simples e rápida.', body: <RouteMockup /> },
                { number: '02', icon: HubIcon, title: 'Conecte-se a um motorista', description: 'A plataforma aproxima passageiro e motorista com praticidade.', body: <DriverConnectMockup /> },
                { number: '03', icon: SecurityIcon, title: 'Acompanhe tudo com segurança', description: 'Viagens e operações com mais controle e transparência.', body: <TrackingMockup /> },
              ].map((step) => (
                <Box
                  key={step.number}
                  className="fade-up"
                  sx={{
                    ...(colorScheme === 'light'
                      ? {
                          background: 'var(--bg-card)',
                          border: '1px solid var(--borders)',
                          boxShadow: 'var(--shadows)',
                          p: { xs: 2.6, md: 3 },
                          minHeight: { xs: 386, md: 372 },
                          zIndex: 1,
                          borderRadius: 3,
                          transition: 'transform .18s ease, box-shadow .18s ease, border-color .18s ease',
                          '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 20px 40px rgba(16,24,40,0.06)', borderColor: 'var(--color-primary)' },
                        }
                      : { ...cardSx, p: { xs: 2.6, md: 3 }, minHeight: { xs: 386, md: 372 }, zIndex: 1 }),
                  }}
                >
                  <GlassIcon icon={step.icon} />
                  <Typography sx={{ mt: 2, color: colorScheme === 'light' ? 'var(--color-primary)' : '#16d9ff', fontSize: 22, fontWeight: 950 }}>{step.number}</Typography>
                  <Typography sx={{ mt: 1.2, color: colorScheme === 'light' ? 'var(--text-primary)' : '#fff', fontSize: 18, fontWeight: 950 }}>{step.title}</Typography>
                  <Typography sx={{ mt: 1, color: colorScheme === 'light' ? 'var(--text-secondary)' : 'rgba(230,241,248,0.72)', fontSize: 13.2, lineHeight: 1.55 }}>{step.description}</Typography>
                  {step.body}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box
          component="section"
          id="valores"
          sx={{
            position: 'relative',
            py: { xs: 7, md: 10 },
            overflow: 'hidden',
            background: isLight
              ? 'linear-gradient(180deg, var(--bg-primary) 0%, #f7fffb 52%, var(--bg-primary) 100%)'
              : 'radial-gradient(circle at 50% 10%, rgba(0,200,255,0.13), transparent 34%), transparent',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: isLight ? 0.45 : 0.65,
              backgroundImage: isLight
                ? 'radial-gradient(circle, rgba(45,212,160,0.16) 1px, transparent 1.5px)'
                : 'radial-gradient(circle, rgba(0,200,255,0.18) 1px, transparent 1.5px)',
              backgroundSize: '42px 42px',
              maskImage: 'linear-gradient(180deg, transparent 0%, #000 18%, #000 76%, transparent 100%)',
            }}
          />
          <Stack sx={{ position: 'relative', zIndex: 1, width: pageWidth, mx: 'auto' }} spacing={{ xs: 4, md: 5 }}>
            <Stack alignItems="center" textAlign="center" spacing={1.5}>
              <Typography
                sx={{
                  px: 4.5,
                  py: 0.75,
                  borderRadius: 999,
                  border: isLight ? '1px solid rgba(45,212,160,0.24)' : '1px solid rgba(0,200,255,0.42)',
                  color: isLight ? 'var(--color-primary)' : '#16d9ff',
                  bgcolor: isLight ? 'rgba(255,255,255,0.78)' : 'rgba(0,200,255,0.06)',
                  boxShadow: isLight ? '0 10px 24px rgba(16,24,40,0.04)' : '0 0 24px rgba(0,200,255,0.14)',
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: 0,
                }}
              >
                PLANOS
              </Typography>
              <Typography
                component="h2"
                sx={{
                  color: isLight ? 'var(--text-primary)' : '#fff',
                  fontSize: { xs: 31, sm: 40, md: 52 },
                  lineHeight: 1.05,
                  fontWeight: 950,
                  letterSpacing: 0,
                  textShadow: isLight ? 'none' : '0 0 34px rgba(0,200,255,0.18)',
                }}
              >
                Planos para{' '}
                <Box component="span" sx={{ color: isLight ? 'var(--color-accent)' : '#16d9ff' }}>
                  motoristas
                </Box>
              </Typography>
              <Typography
                sx={{
                  maxWidth: 620,
                  color: isLight ? 'rgba(31,41,55,0.72)' : 'rgba(230,241,248,0.74)',
                  fontSize: { xs: 15.5, md: 18 },
                  lineHeight: 1.65,
                }}
              >
                Escolha a opção ideal para rodar com liberdade, pagando por período e não por km rodado.
              </Typography>
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' },
                gap: { xs: 2.4, md: 3 },
                alignItems: 'stretch',
              }}
            >
              {pricingPlans.map((plan) => {
                const Icon = plan.icon
                const isPopular = Boolean(plan.popular)

                return (
                  <Box
                    key={plan.title}
                    className="fade-up"
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      minHeight: { xs: 460, md: 500 },
                      p: { xs: 3, md: 3.6 },
                      pt: { xs: 4, md: 4.2 },
                      borderRadius: 5,
                      overflow: 'hidden',
                      border: isPopular
                        ? (isLight ? '1px solid rgba(45,212,160,0.58)' : '1px solid rgba(22,217,255,0.52)')
                        : (isLight ? '1px solid rgba(45,212,160,0.24)' : '1px solid rgba(22,217,255,0.26)'),
                      background: isPopular
                        ? (isLight
                            ? 'radial-gradient(circle at 50% 0%, rgba(45,212,160,0.16), rgba(255,255,255,0.96) 46%), linear-gradient(180deg, rgba(255,255,255,0.98), rgba(245,255,251,0.96))'
                            : 'radial-gradient(circle at 50% 0%, rgba(22,217,255,0.18), rgba(4,16,28,0.96) 50%), linear-gradient(180deg, rgba(7,22,36,0.94), rgba(2,8,16,0.94))')
                        : (isLight
                            ? 'radial-gradient(circle at 50% 0%, rgba(45,212,160,0.07), rgba(255,255,255,0.96) 42%), linear-gradient(180deg, rgba(255,255,255,0.96), rgba(248,255,251,0.92))'
                            : 'radial-gradient(circle at 50% 0%, rgba(22,217,255,0.10), rgba(4,15,26,0.90) 44%), linear-gradient(180deg, rgba(7,22,36,0.88), rgba(2,9,17,0.86))'),
                      boxShadow: isPopular
                        ? (isLight ? '0 24px 80px rgba(45,212,160,0.18), 0 0 0 1px rgba(45,212,160,0.10)' : '0 24px 80px rgba(0,200,255,0.20), 0 0 0 1px rgba(22,217,255,0.12)')
                        : (isLight ? '0 20px 60px rgba(45,212,160,0.10)' : '0 20px 60px rgba(0,200,255,0.10)'),
                      transition: 'transform .3s ease, border-color .3s ease, box-shadow .3s ease, background .3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        borderColor: isPopular
                          ? (isLight ? 'rgba(45,212,160,0.72)' : 'rgba(22,217,255,0.66)')
                          : (isLight ? 'rgba(45,212,160,0.38)' : 'rgba(22,217,255,0.42)'),
                        boxShadow: isPopular
                          ? (isLight ? '0 30px 90px rgba(45,212,160,0.22), 0 0 0 1px rgba(45,212,160,0.14)' : '0 30px 90px rgba(0,200,255,0.24), 0 0 0 1px rgba(22,217,255,0.16)')
                          : (isLight ? '0 24px 70px rgba(45,212,160,0.16)' : '0 24px 70px rgba(0,200,255,0.16)'),
                      },
                    }}
                  >
                    {isPopular && (
                      <Typography
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: '50%',
                          transform: 'translate(-50%, -1px)',
                          px: 3.2,
                          py: 0.8,
                          borderRadius: '0 0 999px 999px',
                          bgcolor: isLight ? 'var(--color-accent)' : '#16d9ff',
                          color: isLight ? '#fff' : '#02111a',
                          fontSize: 12,
                          fontWeight: 950,
                          letterSpacing: 0,
                          whiteSpace: 'nowrap',
                          boxShadow: isLight ? '0 12px 26px rgba(45,212,160,0.28)' : '0 12px 30px rgba(0,200,255,0.32)',
                        }}
                      >
                        MAIS POPULAR
                      </Typography>
                    )}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ minHeight: 52 }}>
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: '50%',
                          display: 'grid',
                          placeItems: 'center',
                          color: isLight ? 'var(--color-primary)' : '#16d9ff',
                          border: isLight ? '1px solid rgba(45,212,160,0.24)' : '1px solid rgba(22,217,255,0.28)',
                          bgcolor: isLight ? 'rgba(45,212,160,0.10)' : 'rgba(22,217,255,0.09)',
                          boxShadow: isLight ? '0 10px 24px rgba(45,212,160,0.08)' : '0 10px 24px rgba(0,200,255,0.10)',
                        }}
                      >
                        <Icon sx={{ fontSize: 25 }} />
                      </Box>
                      <Typography sx={{ color: isLight ? 'var(--text-primary)' : '#fff', fontSize: 20, fontWeight: 950 }}>
                        {plan.title}
                      </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mt: 3 }}>
                      <Typography sx={{ color: isLight ? 'var(--color-primary)' : '#16d9ff', fontSize: 21, fontWeight: 950 }}>
                        R$
                      </Typography>
                      <Typography sx={{ color: isLight ? 'var(--color-accent)' : '#16d9ff', fontSize: { xs: 42, md: 52 }, lineHeight: 1, fontWeight: 950 }}>
                        {plan.price.replace('R$ ', '')}
                      </Typography>
                      <Typography sx={{ color: isLight ? 'rgba(31,41,55,0.66)' : 'rgba(230,241,248,0.78)', fontSize: 16, fontWeight: 700 }}>
                        {plan.period}
                      </Typography>
                    </Stack>

                    <Typography sx={{ mt: 2.2, minHeight: { xs: 48, md: 56 }, color: isLight ? 'rgba(31,41,55,0.72)' : 'rgba(230,241,248,0.74)', fontSize: 15.5, lineHeight: 1.55 }}>
                      {plan.description}
                    </Typography>

                    <Stack spacing={1.4} sx={{ mt: 3, flex: 1 }}>
                      {plan.benefits.map((benefit) => (
                        <Stack key={benefit} direction="row" alignItems="center" spacing={1.3}>
                          <Box
                            sx={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              display: 'grid',
                              placeItems: 'center',
                              flexShrink: 0,
                              border: isLight ? '1px solid rgba(45,212,160,0.42)' : '1px solid rgba(22,217,255,0.58)',
                              color: isLight ? 'var(--color-primary)' : '#16d9ff',
                              bgcolor: isLight ? 'rgba(45,212,160,0.04)' : 'rgba(22,217,255,0.05)',
                            }}
                          >
                            <CheckIcon sx={{ fontSize: 15 }} />
                          </Box>
                          <Typography sx={{ color: isLight ? 'rgba(31,41,55,0.78)' : 'rgba(230,241,248,0.82)', fontSize: 14.5, lineHeight: 1.35 }}>
                            {benefit}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>

                    <Button
                      variant={isPopular ? 'contained' : 'outlined'}
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        mt: 4,
                        minHeight: 52,
                        borderRadius: 999,
                        fontWeight: 950,
                        color: isPopular ? (isLight ? '#fff' : '#02111a') : (isLight ? 'var(--color-primary)' : '#16d9ff'),
                        borderColor: isLight ? 'rgba(45,212,160,0.46)' : 'rgba(22,217,255,0.48)',
                        bgcolor: isPopular ? (isLight ? 'var(--color-accent)' : '#16d9ff') : 'transparent',
                        boxShadow: isPopular ? (isLight ? '0 14px 30px rgba(45,212,160,0.24)' : '0 14px 32px rgba(0,200,255,0.26)') : 'none',
                        transition: 'background .25s ease, border-color .25s ease, box-shadow .25s ease, transform .25s ease',
                        '&:hover': {
                          borderColor: isLight ? 'var(--color-accent)' : '#16d9ff',
                          bgcolor: isPopular ? (isLight ? '#158765' : '#36dfff') : (isLight ? 'rgba(45,212,160,0.08)' : 'rgba(0,200,255,0.08)'),
                          boxShadow: isPopular ? (isLight ? '0 18px 38px rgba(45,212,160,0.30)' : '0 18px 40px rgba(0,200,255,0.34)') : 'none',
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      Escolher plano
                    </Button>
                  </Box>
                )
              })}
            </Box>
          </Stack>
        </Box>

        <Box component="section" id="segurança" sx={{ py: { xs: 7, md: 9 }, background: isLight ? 'var(--bg-primary)' : 'transparent' }}>
          <Box sx={{ width: 'min(1120px, calc(100% - 32px))', mx: 'auto' }}>
            <SectionTitle sx={{ color: isLight ? 'var(--text-primary)' : undefined }}>Recursos que fazem a diferença</SectionTitle>
            <Box
              className="resources-grid"
              sx={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' },
                gap: { xs: 2.5, lg: 0 },
              }}
            >
              <Box className="dream-line" aria-hidden="true">
                <Box className="dream-orb" />
              </Box>
              {featureBlocks.map((feature, index) => (
                <Stack
                  key={feature.title}
                  className="fade-up resource-item"
                  style={{ '--resource-index': index } as CSSProperties}
                  alignItems="center"
                  textAlign="center"
                  spacing={1.3}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRight: {
                      lg: index < featureBlocks.length - 1 ? (isLight ? '1px solid rgba(45,212,160,0.16)' : '1px solid rgba(0,200,255,0.18)') : 'none',
                    },
                    bgcolor: isLight ? 'transparent' : undefined,
                  }}
                >
                  <Box className="resource-icon">
                    <GlassIcon icon={feature.icon} />
                  </Box>
                  <Typography className="resource-title" sx={{ color: isLight ? 'var(--text-primary)' : '#fff', fontSize: 14, fontWeight: 900, transition: 'color .28s ease, text-shadow .28s ease' }}>{feature.title}</Typography>
                  <Typography sx={{ color: isLight ? 'var(--text-secondary)' : 'rgba(230,241,248,0.65)', fontSize: 12.5, lineHeight: 1.45 }}>{feature.description}</Typography>
                </Stack>
              ))}
            </Box>
          </Box>
        </Box>

        <Box component="section" sx={{ py: { xs: 7, md: 9 }, background: isLight ? 'var(--bg-primary)' : 'transparent' }}>
          <Box sx={{ width: pageWidth, mx: 'auto', background: colorScheme === 'light' ? 'var(--bg-primary)' : 'transparent', borderRadius: colorScheme === 'light' ? 4 : 0, py: { xs: 4, md: 6 }, px: { xs: 0, md: 0 } }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
              <Typography sx={{ color: colorScheme === 'light' ? 'var(--text-primary)' : '#fff', fontSize: { xs: 24, md: 30 }, fontWeight: 900 }}>
                Números que nos movem
              </Typography>
              <Box sx={{ width: 68, height: 3, borderRadius: 999, bgcolor: 'var(--color-primary)', mx: 'auto', mt: 2, boxShadow: colorScheme === 'light' ? '0 0 18px rgba(45,212,160,0.12)' : 'none' }} />
            </Box>

            <Box className="stats-grid">
              {stats.map((stat, index) => (
                <Stack
                  key={stat.title}
                  className={`fade-up benefit-card metric-card metric-card-${index}`}
                  spacing={1.45}
                  alignItems="center"
                  textAlign="center"
                  sx={{
                    ...metricsCardSx,
                    p: { xs: 3, md: 3.5 },
                    minHeight: 220,
                    justifyContent: 'center',
                    animationDelay: `${index * 110}ms`,
                  }}
                >
                  <Typography
                    className="number"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'baseline',
                      justifyContent: 'center',
                      m: 0,
                      color: isLight ? 'var(--accent-secondary)' : 'var(--accent-primary)',
                      fontSize: 'clamp(38px, 4.6vw, 54px)',
                      lineHeight: 0.95,
                      fontWeight: 950,
                      letterSpacing: 0,
                      textShadow: isLight ? 'none' : '0 0 18px rgba(0,200,255,0.14)',
                    }}
                  >
                    {stat.value}
                  </Typography>

                  <Typography className="stat-label" sx={{ mt: 1, color: isLight ? 'var(--text-primary)' : '#fff', fontSize: 18, fontWeight: 900, letterSpacing: 0 }}>
                    {stat.title}
                  </Typography>
                  <Typography className="stat-caption" sx={{ m: 0, color: isLight ? 'var(--text-secondary)' : 'rgba(230,241,248,0.72)', fontSize: 14, lineHeight: 1.65 }}>
                    {stat.description}
                  </Typography>
                </Stack>
              ))}
            </Box>
          </Box>
        </Box>

        <Box component="section" id="sobre-nós" sx={{ py: { xs: 7, md: 10 }, background: isLight ? 'var(--bg-primary)' : 'transparent' }}>
          <Box sx={{ width: 'min(1120px, calc(100% - 32px))', mx: 'auto' }}>
            <SectionTitle>O que dizem sobre nós</SectionTitle>
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
                {testimonials.map((item) => (
                  <Stack
                    key={item.name}
                    direction="row"
                    spacing={2}
                    sx={{
                      ...cardSx,
                      p: 2.6,
                      minHeight: 154,
                      border: isLight ? '1px solid rgba(45,212,160,0.16)' : cardSx.border,
                      background: isLight ? '#fff' : cardSx.background,
                      boxShadow: isLight ? '0 14px 34px rgba(16,24,40,0.08)' : cardSx.boxShadow,
                      '&:hover': {
                        ...cardSx['&:hover'],
                        borderColor: isLight ? 'rgba(45,212,160,0.28)' : cardSx['&:hover'].borderColor,
                        boxShadow: isLight ? '0 20px 48px rgba(16,24,40,0.1)' : cardSx['&:hover'].boxShadow,
                      },
                    }}
                  >
                    <Box sx={{ flex: '0 0 auto', width: 54, height: 54, borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 950, color: isLight ? '#0f8f6a' : '#02101a', background: isLight ? 'linear-gradient(135deg, rgba(45,212,160,0.18), rgba(255,255,255,0.94))' : 'linear-gradient(135deg, #fff, #16d9ff)' }}>{item.initials}</Box>
                    <Box>
                      <Typography sx={{ color: isLight ? 'rgba(31,41,55,0.78)' : 'rgba(244,248,251,0.84)', fontSize: 14, lineHeight: 1.6 }}>{item.text}</Typography>
                      <Typography sx={{ color: isLight ? 'var(--text-primary)' : '#fff', fontWeight: 950, mt: 1.4, fontSize: 13 }}>{item.name}</Typography>
                      <Stack direction="row" spacing={0.3} sx={{ mt: 0.6 }}>
                        {Array.from({ length: 5 }).map((_, index) => (
                          <StarIcon key={index} sx={{ color: '#ffc857', fontSize: 14 }} />
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                ))}
              </Box>
              {['‹', '›'].map((arrow, index) => (
                <Box key={arrow} sx={{ display: { xs: 'none', lg: 'grid' }, position: 'absolute', top: '50%', [index === 0 ? 'left' : 'right']: -58, width: 42, height: 58, placeItems: 'center', borderRadius: 999, color: isLight ? 'var(--color-accent)' : '#16d9ff', border: isLight ? '1px solid rgba(45,212,160,0.22)' : '1px solid rgba(0,200,255,0.18)', bgcolor: isLight ? 'rgba(255,255,255,0.92)' : 'rgba(6,24,40,0.72)', boxShadow: isLight ? '0 10px 24px rgba(16,24,40,0.08)' : 'none', fontSize: 30 }}>
                  {arrow}
                </Box>
              ))}
            </Box>
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 4 }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Box key={index} sx={{ width: index === 0 ? 18 : 8, height: 8, borderRadius: 999, bgcolor: index === 0 ? (isLight ? 'var(--color-accent)' : '#16d9ff') : (isLight ? 'rgba(16,24,40,0.14)' : 'rgba(0,200,255,0.22)') }} />
              ))}
            </Stack>
          </Box>
        </Box>

      </Box>

      <Box
        component="footer"
        sx={{
          borderTop: isLight ? '1px solid rgba(45,212,160,0.14)' : '1px solid rgba(0,200,255,0.16)',
          bgcolor: isLight ? '#fff' : 'rgba(2,7,13,0.92)',
          boxShadow: isLight ? '0 -10px 28px rgba(16,24,40,0.04)' : 'none',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems="center"
          justifyContent={{ xs: 'center', md: 'space-between' }}
          spacing={{ xs: 0.5, md: 0 }}
          sx={{ width: pageWidth, mx: 'auto', py: { xs: 1.5, md: 1.75 } }}
        >
          <Box component="img" src={logo} alt="BorAli" sx={{ width: { xs: 78, md: 84 }, height: 'auto' }} />
          <Typography
            sx={{
              color: isLight ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.55)',
              fontSize: { xs: 11, sm: 12 },
              fontWeight: 500,
              lineHeight: 1.4,
              textAlign: { xs: 'center', md: 'right' },
              letterSpacing: 0,
            }}
          >
            © 2026 doneThink. All rights reserved.
          </Typography>
        </Stack>
      </Box>
    </Box>
  )
}
