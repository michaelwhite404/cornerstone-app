export interface DecodedPayload {
  /** Id or email of the user */
  id: string;
  /** Date the token was issued (seconds since Unix epoch) */
  iat: number;
  /** Date the token will expire (seconds since Unix epoch) */
  exp: number;
}

export default DecodedPayload;
