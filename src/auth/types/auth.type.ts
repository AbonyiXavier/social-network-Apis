export type JwtPayload = {
  email: string;
  userId: string;
};

export type JwtPayloadWithRefreshedToken = JwtPayload & { refreshToken: string }; // extend JwtPayload properties to JwtPayloadWithRefreshedToken
