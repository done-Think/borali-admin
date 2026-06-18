import AndroidIcon from '@mui/icons-material/Android'
import AppleIcon from '@mui/icons-material/Apple'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
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
import { Box, Button, Stack, Typography } from '@mui/material'
import { useAuthStore } from '@shared/store'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import carTopView from '@/assets/car-top-view-transparent.png'
import loginMapBg from '@/assets/login-map-bg.png'
import logo from '@/assets/logo.png'

const navLinks = ['Passageiros', 'Motoristas', 'Segurança', 'Suporte', 'Sobre nós']

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

const stats = [
  { value: '+25K', title: 'Viagens realizadas', description: 'Todos os dias', icon: DirectionsCarIcon },
  { value: '+8K', title: 'Motoristas parceiros', description: 'Ativos na plataforma', icon: GroupsIcon },
  { value: '+50K', title: 'Passageiros satisfeitos', description: 'Em toda a região', icon: AutoAwesomeIcon },
  { value: '4.9', title: 'Avaliação média', description: 'Confiança que nos guia', icon: StarIcon },
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

function SectionTitle({ children }: { children: string }) {
  return (
    <Stack spacing={1.25} alignItems="center" sx={{ mb: { xs: 3.5, md: 5 } }}>
      <Typography variant="h2" sx={{ color: '#f7fbff', fontSize: { xs: 22, md: 26 }, fontWeight: 900 }}>
        {children}
      </Typography>
      <Box sx={{ width: 54, height: 2, borderRadius: 999, bgcolor: '#16d9ff', boxShadow: '0 0 18px #00c8ff' }} />
    </Stack>
  )
}

function GlassIcon({ icon: Icon }: { icon: typeof PaidIcon }) {
  return (
    <Box
      className="pulse-icon"
      sx={{
        width: 44,
        height: 44,
        display: 'grid',
        placeItems: 'center',
        borderRadius: '50%',
        color: '#16d9ff',
        border: '1px solid rgba(0, 200, 255, 0.35)',
        bgcolor: 'rgba(0, 200, 255, 0.08)',
        boxShadow: 'inset 0 0 18px rgba(0, 200, 255, 0.16), 0 0 22px rgba(0, 200, 255, 0.14)',
      }}
    >
      <Icon sx={{ fontSize: 22 }} />
    </Box>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <Stack spacing={1.25}>
      {items.map((item) => (
        <Stack key={item} direction="row" spacing={1} alignItems="center">
          <CheckIcon sx={{ color: '#16d9ff', fontSize: 16 }} />
          <Typography sx={{ color: 'rgba(230, 241, 248, 0.82)', fontSize: 13 }}>{item}</Typography>
        </Stack>
      ))}
    </Stack>
  )
}

function MiniMap({ secure = false }: { secure?: boolean }) {
  return (
    <Box
      sx={{
        position: 'relative',
        height: 160,
        mt: 3,
        borderRadius: 4,
        border: '1px solid rgba(0, 200, 255, 0.18)',
        overflow: 'hidden',
        bgcolor: 'rgba(2, 11, 19, 0.78)',
        backgroundImage:
          'linear-gradient(rgba(0,200,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.05) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
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
                background: 'linear-gradient(90deg, #16d9ff, #00c8ff)',
                boxShadow: '0 0 14px rgba(0,200,255,0.72)',
                transform: 'translateY(-50%)',
              }}
            />
            <PlaceIcon
              sx={{
                position: 'absolute',
                left: -13,
                top: '50%',
                color: '#9eefff',
                fontSize: 24,
                transform: 'translateY(-50%) rotate(20deg)',
              }}
            />
            <PlaceIcon
              sx={{
                position: 'absolute',
                right: -15,
                top: '50%',
                color: '#16d9ff',
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
                filter: 'drop-shadow(0 0 10px rgba(0, 200, 255, 0.35)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.30))',
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
              borderTop: '3px solid #00c8ff',
              borderRight: '3px solid #00c8ff',
              transform: 'skew(-18deg) rotate(-28deg)',
              borderRadius: 2,
              filter: 'drop-shadow(0 0 10px rgba(0,200,255,0.55))',
            }}
          />
          <PlaceIcon sx={{ position: 'absolute', top: 36, right: 68, color: '#16d9ff' }} />
          <PlaceIcon sx={{ position: 'absolute', bottom: 48, left: 112, color: '#9eefff', fontSize: 20 }} />
        </>
      )}
      {secure ? (
        <>
          <Box sx={{ position: 'absolute', top: 26, left: 24 }}>
            <Typography sx={{ color: '#f7fbff', fontWeight: 800, fontSize: 13 }}>A caminho do destino</Typography>
            <Typography sx={{ color: 'rgba(230,241,248,0.72)', fontSize: 12 }}>12 min</Typography>
            <Typography sx={{ color: 'rgba(230,241,248,0.72)', fontSize: 12 }}>3,2 km</Typography>
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
              sx={{ px: 1.5, py: 1, borderRadius: 2, bgcolor: 'rgba(0, 9, 16, 0.58)' }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', border: '1px solid #00c8ff' }} />
              <Typography sx={{ color: 'rgba(230,241,248,0.68)', fontSize: 12 }}>{label}</Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  )
}

function RouteMockup() {
  return (
    <Box
      sx={{
        position: 'relative',
        mt: 2.4,
        height: 158,
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid rgba(0, 200, 255, 0.18)',
        bgcolor: 'rgba(2, 11, 19, 0.82)',
        backgroundImage:
          'radial-gradient(circle at 78% 24%, rgba(0,200,255,.16), transparent 7%), linear-gradient(rgba(0,200,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.055) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 28px 28px, 28px 28px',
        boxShadow: 'inset 0 0 34px rgba(0, 200, 255, 0.05)',
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
            stroke: '#10d8ff',
            strokeWidth: 3,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            filter: 'drop-shadow(0 0 8px rgba(0, 200, 255, 0.65))',
          }}
        />
      </Box>
      <PlaceIcon
        sx={{
          position: 'absolute',
          left: '28.75%',
          top: '55.7%',
          color: '#9eefff',
          fontSize: 24,
          zIndex: 3,
          transform: 'translate(-50%, -100%)',
          filter: 'drop-shadow(0 0 8px rgba(0,200,255,.55))',
        }}
      />
      <PlaceIcon
        sx={{
          position: 'absolute',
          left: '74.4%',
          top: '17.7%',
          color: '#16d9ff',
          fontSize: 24,
          zIndex: 3,
          transform: 'translate(-50%, -100%)',
          filter: 'drop-shadow(0 0 8px rgba(0,200,255,.55))',
        }}
      />
      <Box sx={{ position: 'absolute', left: '80%', top: '21%', width: 8, height: 8, borderRadius: '50%', bgcolor: '#9eefff', boxShadow: '0 0 16px #16d9ff', zIndex: 2 }} />
      <Stack spacing={1} sx={{ position: 'absolute', left: 18, right: 18, bottom: 16 }}>
        {['Origem', 'Destino'].map((label, index) => (
          <Stack
            key={label}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 1.2, py: 0.8, borderRadius: 2, bgcolor: 'rgba(0, 8, 14, 0.58)', border: '1px solid rgba(0,200,255,0.08)' }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', border: '1px solid #00c8ff', bgcolor: index === 0 ? 'transparent' : 'rgba(0,200,255,.22)' }} />
              <Typography sx={{ color: 'rgba(230,241,248,0.62)', fontSize: 11 }}>{label}</Typography>
            </Stack>
            <Box sx={{ width: 18, height: 8, borderRadius: 999, bgcolor: 'rgba(0,200,255,.14)' }} />
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}

function DriverConnectMockup() {
  return (
    <Box
      sx={{
        position: 'relative',
        mt: 2.4,
        minHeight: 158,
        overflow: 'hidden',
        borderRadius: 4,
        border: '1px solid rgba(0, 200, 255, 0.18)',
        background: 'linear-gradient(135deg, rgba(3, 16, 28, 0.86), rgba(5, 24, 39, 0.74))',
        boxShadow: 'inset 0 0 30px rgba(0, 200, 255, 0.04), 0 18px 40px rgba(0, 0, 0, 0.28)',
        p: 2.2,
        '&::after': {
          content: '""',
          position: 'absolute',
          right: -35,
          bottom: -35,
          width: 160,
          height: 110,
          background: 'radial-gradient(circle, rgba(0, 200, 255, 0.18), transparent 65%)',
          zIndex: 0,
        },
        '&:hover .driver-car': {
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
            background: 'linear-gradient(135deg, #62e5ff, #12cfff)',
            boxShadow: '0 0 24px rgba(0, 200, 255, 0.3)',
          }}
        >
          JS
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: '#f7fbff', fontWeight: 950, fontSize: 14 }}>João Silva</Typography>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <StarIcon sx={{ color: '#ffc857', fontSize: 14 }} />
            <Typography sx={{ color: 'rgba(230,241,248,0.78)', fontSize: 11 }}>4.9</Typography>
          </Stack>
          <Typography sx={{ color: '#16d9ff', fontSize: 11, fontWeight: 800 }}>Motorista parceiro</Typography>
        </Box>
      </Stack>
      <Stack spacing={0.6} sx={{ position: 'relative', zIndex: 2, mt: 1.4, maxWidth: { xs: '58%', sm: '54%' } }}>
        <Typography sx={{ color: 'rgba(230,241,248,0.84)', fontSize: 12.5 }}>Volkswagen T-Cross - Prata</Typography>
        <Typography sx={{ color: 'rgba(230,241,248,0.84)', fontSize: 12.5, letterSpacing: 0.5 }}>ABC-1023</Typography>
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
          filter: 'drop-shadow(0 14px 24px rgba(0, 200, 255, 0.22)) drop-shadow(0 8px 18px rgba(0, 0, 0, 0.42))',
        }}
      />
    </Box>
  )
}

function TrackingMockup() {
  return (
    <Box
      sx={{
        position: 'relative',
        mt: 2.4,
        height: 158,
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid rgba(0, 200, 255, 0.18)',
        bgcolor: 'rgba(2, 11, 19, 0.82)',
        backgroundImage:
          'radial-gradient(circle at 86% 21%, rgba(0,200,255,.18), transparent 7%), linear-gradient(rgba(0,200,255,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,255,0.055) 1px, transparent 1px)',
        backgroundSize: '100% 100%, 28px 28px, 28px 28px',
        boxShadow: 'inset 0 0 34px rgba(0, 200, 255, 0.05)',
      }}
    >
      <Box sx={{ position: 'absolute', top: 18, left: 18 }}>
        <Typography sx={{ color: '#f7fbff', fontWeight: 900, fontSize: 12 }}>A caminho do destino</Typography>
        <Typography sx={{ color: 'rgba(230,241,248,0.68)', fontSize: 11 }}>12 min</Typography>
        <Typography sx={{ color: 'rgba(230,241,248,0.68)', fontSize: 11 }}>3,2 km</Typography>
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
            stroke: '#10d8ff',
            strokeWidth: 3,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            filter: 'drop-shadow(0 0 8px rgba(0, 200, 255, 0.65))',
          }}
        />
      </Box>
      <PlaceIcon
        sx={{
          position: 'absolute',
          left: '21.9%',
          top: '73.4%',
          color: '#9eefff',
          fontSize: 24,
          zIndex: 3,
          transform: 'translate(-50%, -100%)',
          filter: 'drop-shadow(0 0 8px rgba(0,200,255,.55))',
        }}
      />
      <PlaceIcon
        sx={{
          position: 'absolute',
          left: '81.9%',
          top: '15.2%',
          color: '#16d9ff',
          fontSize: 26,
          zIndex: 3,
          transform: 'translate(-50%, -100%)',
          filter: 'drop-shadow(0 0 8px rgba(0,200,255,.55))',
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
          filter: 'drop-shadow(0 0 8px rgba(0, 200, 255, 0.42)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.35))',
          zIndex: 4,
          pointerEvents: 'none',
          transition: 'transform 0.3s ease, filter 0.3s ease',
        }}
      />
      <Box sx={{ position: 'absolute', left: '86%', top: '16%', width: 8, height: 8, borderRadius: '50%', bgcolor: '#9eefff', boxShadow: '0 0 16px #16d9ff', zIndex: 2 }} />
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
          '0%, 100%': { boxShadow: '0 0 18px rgba(0, 200, 255, 0.16), inset 0 0 18px rgba(0, 200, 255, 0.12)' },
          '50%': { boxShadow: '0 0 34px rgba(0, 200, 255, 0.32), inset 0 0 24px rgba(0, 200, 255, 0.18)' },
        },
        '@keyframes dashMove': {
          to: { backgroundPosition: '44px 0' },
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
        '.fade-up': { animation: 'fadeUp .78s ease both' },
        '.float-soft': { animation: 'floatSoft 5.5s ease-in-out infinite' },
        '.pulse-icon': { animation: 'pulseGlow 3s ease-in-out infinite' },
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
          borderBottom: '1px solid rgba(0, 200, 255, 0.1)',
          bgcolor: 'rgba(2, 7, 13, 0.76)',
          backdropFilter: 'blur(18px)',
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
                sx={{ color: 'rgba(244,248,251,0.72)', fontSize: 14, textDecoration: 'none', '&:hover': { color: '#16d9ff' } }}
              >
                {item}
              </Typography>
            ))}
          </Stack>
          <Button variant="contained" color="secondary" onClick={goToLogin} sx={{ px: { xs: 1.8, md: 2.8 }, minHeight: 42, fontWeight: 900, boxShadow: '0 0 26px rgba(0, 200, 255, 0.28)' }}>
            Acessar Admin
          </Button>
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
          }}
        >
          <Box sx={{ width: pageWidth, mx: 'auto', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.05fr .95fr' }, gap: { xs: 5, md: 8 }, alignItems: 'center' }}>
            <Stack spacing={3.2} className="fade-up">
              <Box sx={{ width: 98, height: 5, borderRadius: 999, background: 'linear-gradient(90deg, #00c8ff, transparent)' }} />
              <Typography variant="h1" sx={{ fontSize: { xs: 42, sm: 58, md: 76 }, lineHeight: 0.98, fontWeight: 950, letterSpacing: 0, color: '#fff', textShadow: '0 0 42px rgba(0, 200, 255, 0.22)' }}>
                Mobilidade justa para todos.
              </Typography>
              <Typography sx={{ maxWidth: 660, color: 'rgba(230, 241, 248, 0.78)', fontSize: { xs: 16, md: 19 }, lineHeight: 1.75 }}>
                Peça viagens com transparência, segurança e preço justo. A BorAli conecta passageiros e motoristas em uma experiência mais humana.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button size="large" variant="contained" color="secondary" endIcon={<ArrowForwardIcon />} onClick={goToLogin} sx={{ minHeight: 52, px: 3.4, fontWeight: 900, boxShadow: '0 0 34px rgba(0, 200, 255, 0.32)' }}>
                  Começar agora
                </Button>
                <Button size="large" variant="outlined" href="#nossos-beneficios" sx={{ minHeight: 52, px: 3.4, color: '#f4f8fb', borderColor: 'rgba(0, 200, 255, 0.36)', fontWeight: 900, '&:hover': { borderColor: '#16d9ff', bgcolor: 'rgba(0, 200, 255, 0.06)' } }}>
                  Conhecer a BorAli
                </Button>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                {['Motorista verificado', 'Preço transparente', 'Rota segura'].map((item) => (
                  <Stack key={item} direction="row" spacing={1} alignItems="center" sx={{ width: 'fit-content', px: 1.6, py: 1, borderRadius: 999, border: '1px solid rgba(0, 200, 255, 0.18)', bgcolor: 'rgba(6, 24, 40, 0.72)' }}>
                    <CheckIcon sx={{ color: '#16d9ff', fontSize: 16 }} />
                    <Typography sx={{ color: 'rgba(244,248,251,0.82)', fontSize: 13, fontWeight: 700 }}>{item}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>

            <Box className="float-soft" sx={{ ...cardSx, minHeight: { xs: 420, md: 560 }, p: { xs: 3, md: 4 }, display: { xs: 'none', sm: 'block' } }}>
              <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(180deg, rgba(2,7,13,0.2), rgba(2,7,13,0.95)), url(${loginMapBg})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.74 }} />
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
                    <Stack key={label} direction="row" justifyContent="space-between" sx={{ p: 1.6, borderRadius: 3, bgcolor: 'rgba(0, 8, 14, 0.58)', border: '1px solid rgba(0, 200, 255, 0.12)' }}>
                      <Typography sx={{ color: 'rgba(230,241,248,0.62)', fontSize: 13 }}>{label}</Typography>
                      <Typography sx={{ color: '#f7fbff', fontSize: 13, fontWeight: 900 }}>{value}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box component="section" id="nossos-beneficios" sx={{ py: { xs: 7, md: 9 } }}>
          <Box sx={{ width: pageWidth, mx: 'auto' }}>
            <SectionTitle>Nossos benefícios</SectionTitle>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2.5 }}>
              {benefits.map((benefit, index) => (
                <Stack key={benefit.title} className="fade-up" spacing={2.2} sx={{ ...cardSx, p: 2.8, minHeight: 246, animationDelay: `${index * 80}ms` }}>
                  <GlassIcon icon={benefit.icon} />
                  <Box>
                    <Typography sx={{ color: '#fff', fontSize: 20, fontWeight: 900, mb: 1 }}>{benefit.title}</Typography>
                    <Typography sx={{ color: 'rgba(230,241,248,0.78)', fontSize: 13.5, fontWeight: 700 }}>{benefit.description}</Typography>
                  </Box>
                  <Bullets items={benefit.bullets} />
                </Stack>
              ))}
            </Box>
          </Box>
        </Box>

        <Box component="section" sx={{ py: { xs: 3, md: 4 } }}>
          <Stack alignItems="center" spacing={1.8} sx={{ ...cardSx, width: 'min(1080px, calc(100% - 32px))', mx: 'auto', py: { xs: 4.5, md: 6 }, px: 3, textAlign: 'center' }}>
            <GlassIcon icon={VerifiedUserIcon} />
            <Typography sx={{ color: '#fff', fontSize: { xs: 24, md: 32 }, fontWeight: 950 }}>Mobilidade justa para motoristas e passageiros.</Typography>
            <Typography sx={{ color: 'rgba(230,241,248,0.75)', fontSize: 15 }}>Mais que uma plataforma, um novo jeito de se mover.</Typography>
          </Stack>
        </Box>

        <Box component="section" id="passageiros" sx={{ py: { xs: 8, md: 10 } }}>
          <Box sx={{ width: pageWidth, mx: 'auto' }}>
            <SectionTitle>Soluções para cada necessidade</SectionTitle>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 2.8 }}>
              {solutions.map((solution) => (
                <Stack key={solution.title} sx={{ ...cardSx, p: 3, minHeight: 300 }}>
                  <GlassIcon icon={solution.icon} />
                  <Typography sx={{ mt: 3, color: '#fff', fontSize: 21, fontWeight: 950 }}>{solution.title}</Typography>
                  <Typography sx={{ mt: 1.2, color: 'rgba(230,241,248,0.78)', maxWidth: 260, fontSize: 14.5, lineHeight: 1.65 }}>{solution.text}</Typography>
                  <Box sx={{ mt: 2.2, maxWidth: 260 }}>
                    <Bullets items={solution.bullets} />
                  </Box>
                  <Button endIcon={<ArrowForwardIcon />} sx={{ mt: 2.5, p: 0, justifyContent: 'flex-start', color: '#16d9ff', fontWeight: 900, width: 'fit-content' }}>
                    Saiba mais
                  </Button>
                  {solution.visual === 'dashboard' ? (
                    <Box sx={{ position: 'absolute', right: -18, bottom: 24, width: 220, height: 154, opacity: 0.55, borderRadius: 3, border: '1px solid rgba(0,200,255,0.18)', background: 'linear-gradient(145deg, rgba(0,200,255,0.12), rgba(2,7,13,0.4))' }}>
                      <Box sx={{ position: 'absolute', right: 26, top: 28, width: 76, height: 76, borderRadius: '50%', border: '10px solid rgba(0,200,255,0.36)', borderLeftColor: 'rgba(255,255,255,0.08)' }} />
                      {[20, 48, 76, 104].map((top) => (
                        <Box key={top} sx={{ position: 'absolute', left: 20, top, width: 80 + top / 3, height: 8, borderRadius: 999, bgcolor: 'rgba(0,200,255,0.18)' }} />
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ position: 'absolute', right: { xs: -28, sm: 2 }, bottom: -8, width: 150, height: 220, opacity: { xs: 0.2, sm: 0.72 } }}>
                      <Box sx={{ position: 'absolute', left: 34, top: 18, width: 74, height: 74, borderRadius: '50%', background: 'linear-gradient(135deg, #f7fbff, #16d9ff)' }} />
                      <Box sx={{ position: 'absolute', left: 18, top: 88, width: 112, height: 150, borderRadius: '56px 56px 18px 18px', background: solution.visual === 'driver' ? 'linear-gradient(180deg, #0e3850, #061521)' : 'linear-gradient(180deg, #d6e3e8, #5e7884)', boxShadow: '0 0 38px rgba(0,200,255,0.16)' }} />
                    </Box>
                  )}
                </Stack>
              ))}
            </Box>
          </Box>
        </Box>

        <Box component="section" id="motoristas" sx={{ py: { xs: 7, md: 10 } }}>
          <Box sx={{ width: pageWidth, mx: 'auto' }}>
            <SectionTitle>Como funciona</SectionTitle>
            <Box sx={{ position: 'relative', display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 2.4, '&::before': { content: '""', display: { xs: 'none', lg: 'block' }, position: 'absolute', top: 38, left: '11%', right: '11%', height: 1, backgroundImage: 'linear-gradient(90deg, rgba(0,200,255,.55) 50%, transparent 0)', backgroundSize: '22px 1px', filter: 'drop-shadow(0 0 8px rgba(0,200,255,.65))', animation: 'dashMove 1.4s linear infinite' } }}>
              {[
                { number: '01', icon: PlaceIcon, title: 'Informe sua rota', description: 'Escolha origem e destino de forma simples e rápida.', body: <RouteMockup /> },
                { number: '02', icon: HubIcon, title: 'Conecte-se a um motorista', description: 'A plataforma aproxima passageiro e motorista com praticidade.', body: <DriverConnectMockup /> },
                { number: '03', icon: SecurityIcon, title: 'Acompanhe tudo com segurança', description: 'Viagens e operações com mais controle e transparência.', body: <TrackingMockup /> },
              ].map((step) => (
                <Box key={step.number} className="fade-up" sx={{ ...cardSx, p: { xs: 2.6, md: 3 }, minHeight: { xs: 386, md: 372 }, zIndex: 1 }}>
                  <GlassIcon icon={step.icon} />
                  <Typography sx={{ mt: 2, color: '#16d9ff', fontSize: 22, fontWeight: 950 }}>{step.number}</Typography>
                  <Typography sx={{ mt: 1.2, color: '#fff', fontSize: 18, fontWeight: 950 }}>{step.title}</Typography>
                  <Typography sx={{ mt: 1, color: 'rgba(230,241,248,0.72)', fontSize: 13.2, lineHeight: 1.55 }}>{step.description}</Typography>
                  {step.body}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box component="section" id="segurança" sx={{ py: { xs: 7, md: 9 } }}>
          <Box sx={{ width: 'min(1120px, calc(100% - 32px))', mx: 'auto' }}>
            <SectionTitle>Recursos que fazem a diferença</SectionTitle>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }, gap: { xs: 2.5, lg: 0 } }}>
              {featureBlocks.map((feature, index) => (
                <Stack key={feature.title} alignItems="center" textAlign="center" spacing={1.3} sx={{ px: 3, py: 1.5, borderRight: { lg: index < featureBlocks.length - 1 ? '1px solid rgba(0,200,255,0.18)' : 'none' } }}>
                  <GlassIcon icon={feature.icon} />
                  <Typography sx={{ color: '#fff', fontSize: 14, fontWeight: 900 }}>{feature.title}</Typography>
                  <Typography sx={{ color: 'rgba(230,241,248,0.65)', fontSize: 12.5, lineHeight: 1.45 }}>{feature.description}</Typography>
                </Stack>
              ))}
            </Box>
          </Box>
        </Box>

        <Box component="section" sx={{ py: { xs: 5, md: 8 } }}>
          <Box sx={{ ...cardSx, width: 'min(1160px, calc(100% - 32px))', mx: 'auto', p: { xs: 3, md: 4.5 } }}>
            <SectionTitle>Números que nos movem</SectionTitle>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2 }}>
              {stats.map((stat, index) => (
                <Stack key={stat.title} alignItems="center" textAlign="center" spacing={1.2} sx={{ py: 2, borderRight: { lg: index < stats.length - 1 ? '1px solid rgba(0,200,255,0.14)' : 'none' } }}>
                  <GlassIcon icon={stat.icon} />
                  <Typography sx={{ color: '#16d9ff', fontSize: { xs: 38, md: 48 }, lineHeight: 1, fontWeight: 950, textShadow: '0 0 22px rgba(0,200,255,0.32)' }}>
                    {stat.value}{stat.value === '4.9' && <StarIcon sx={{ color: '#ffc857', fontSize: 24, ml: 0.5 }} />}
                  </Typography>
                  <Typography sx={{ color: '#fff', fontSize: 14, fontWeight: 900 }}>{stat.title}</Typography>
                  <Typography sx={{ color: 'rgba(230,241,248,0.65)', fontSize: 13 }}>{stat.description}</Typography>
                </Stack>
              ))}
            </Box>
          </Box>
        </Box>

        <Box component="section" id="sobre-nós" sx={{ py: { xs: 7, md: 10 } }}>
          <Box sx={{ width: 'min(1120px, calc(100% - 32px))', mx: 'auto' }}>
            <SectionTitle>O que dizem sobre nós</SectionTitle>
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
                {testimonials.map((item) => (
                  <Stack key={item.name} direction="row" spacing={2} sx={{ ...cardSx, p: 2.6, minHeight: 154 }}>
                    <Box sx={{ flex: '0 0 auto', width: 54, height: 54, borderRadius: '50%', display: 'grid', placeItems: 'center', fontWeight: 950, color: '#02101a', background: 'linear-gradient(135deg, #fff, #16d9ff)' }}>{item.initials}</Box>
                    <Box>
                      <Typography sx={{ color: 'rgba(244,248,251,0.84)', fontSize: 14, lineHeight: 1.6 }}>{item.text}</Typography>
                      <Typography sx={{ color: '#fff', fontWeight: 950, mt: 1.4, fontSize: 13 }}>{item.name}</Typography>
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
                <Box key={arrow} sx={{ display: { xs: 'none', lg: 'grid' }, position: 'absolute', top: '50%', [index === 0 ? 'left' : 'right']: -58, width: 42, height: 58, placeItems: 'center', borderRadius: 999, color: '#16d9ff', border: '1px solid rgba(0,200,255,0.18)', bgcolor: 'rgba(6,24,40,0.72)', fontSize: 30 }}>
                  {arrow}
                </Box>
              ))}
            </Box>
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 4 }}>
              {Array.from({ length: 5 }).map((_, index) => (
                <Box key={index} sx={{ width: index === 0 ? 18 : 8, height: 8, borderRadius: 999, bgcolor: index === 0 ? '#16d9ff' : 'rgba(0,200,255,0.22)' }} />
              ))}
            </Stack>
          </Box>
        </Box>

        <Box component="section" id="suporte" sx={{ pt: { xs: 6, md: 9 }, pb: 0 }}>
          <Box sx={{ ...cardSx, width: pageWidth, mx: 'auto', minHeight: { xs: 420, md: 300 }, p: { xs: 3, md: 5 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '240px 1fr 260px' }, alignItems: 'center', gap: 3, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>
            <Box className="float-soft" sx={{ width: 160, height: 270, mx: { xs: 'auto', md: 0 }, borderRadius: '30px', border: '8px solid rgba(255,255,255,0.14)', bgcolor: '#02070d', transform: 'rotate(-8deg)', display: 'grid', placeItems: 'center', boxShadow: '0 0 44px rgba(0,200,255,0.18)' }}>
              <Box component="img" src={logo} alt="BorAli" sx={{ width: 92 }} />
            </Box>
            <Stack alignItems="center" textAlign="center" spacing={1.4}>
              <Typography sx={{ color: '#fff', fontSize: { xs: 30, md: 38 }, lineHeight: 1.1, fontWeight: 950 }}>Pronto para uma nova experiência?</Typography>
              <Typography sx={{ color: 'rgba(230,241,248,0.75)', fontSize: 16 }}>Baixe agora e descubra uma mobilidade mais justa para todos.</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1.4 }}>
                <Button variant="outlined" startIcon={<AppleIcon />} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.28)', bgcolor: 'rgba(0,0,0,0.28)', px: 2.4 }}>App Store</Button>
                <Button variant="outlined" startIcon={<AndroidIcon />} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.28)', bgcolor: 'rgba(0,0,0,0.28)', px: 2.4 }}>Google Play</Button>
              </Stack>
            </Stack>
            <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'relative', height: 190 }}>
              <DirectionsCarIcon sx={{ position: 'absolute', right: 0, bottom: 18, color: '#dff7ff', fontSize: 170, filter: 'drop-shadow(0 0 32px rgba(0,200,255,0.38))' }} />
              <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 74, background: 'repeating-linear-gradient(90deg, rgba(0,200,255,0.14) 0 22px, transparent 22px 36px)' }} />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box component="footer" sx={{ borderTop: '1px solid rgba(0,200,255,0.16)', bgcolor: 'rgba(2,7,13,0.92)' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 3 }} alignItems="center" justifyContent="space-between" sx={{ width: pageWidth, mx: 'auto', py: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box component="img" src={logo} alt="BorAli" sx={{ width: 110 }} />
            <Typography sx={{ color: 'rgba(244,248,251,0.72)', fontWeight: 700 }}>Mobilidade justa para todos.</Typography>
          </Stack>
          <Stack direction="row" spacing={{ xs: 1.5, md: 3 }} flexWrap="wrap" justifyContent="center">
            {navLinks.map((item) => (
              <Typography key={item} sx={{ color: 'rgba(244,248,251,0.68)', fontSize: 13 }}>{item}</Typography>
            ))}
          </Stack>
          <Button variant="contained" color="secondary" onClick={goToLogin} sx={{ px: 2.8, fontWeight: 900, boxShadow: '0 0 24px rgba(0,200,255,0.26)' }}>
            Acessar Admin
          </Button>
        </Stack>
      </Box>
    </Box>
  )
}
