import { OnboardingStatus, Role } from "./enums"

export type JWTPayloadType = {
    sub: string,
    email: string,
    role: Role,
    onboardingStatus: OnboardingStatus
}

export type AccessTokenType = {
    accessToken: string
}