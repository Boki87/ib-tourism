import { IronSessionOptions } from "iron-session";

export const sessionOptions: IronSessionOptions = {
  password: "lkjafsdklfasdhfljahfuajshfuiohuih1234234155511kjljlj1i5",
  cookieName: "tapapp-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: +new Date() + 60 * 1000 * 60 * 24,
  },
};

declare module "iron-session" {
  interface IronSessionData {
    customer?: number;
  }
}
