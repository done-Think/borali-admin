import type { Driver, DriverDetails, DriverRequest } from '../types'

export const drivers: Driver[] = []
export const driverRequests: DriverRequest[] = []
export const driverDetailsById: Record<string, DriverDetails> = {}
