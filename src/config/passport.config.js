import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

import { sessionsService } from "../services/sessions.service.js";


export const initializePassport = () => {
 passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const user = await sessionsService.register({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email,
          password
        });

        return done(null, user);
      } catch (error) {
        return done(null, false, {
          message: error.message,
          statusCode: error.statusCode
        });
      }
    }
  )
);

 passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      try {
        const user = await sessionsService.login(
          email,
          password
        );

        return done(null, user);
      } catch (error) {
        return done(null, false, {
          message: error.message,
          statusCode: error.statusCode
        });
      }
    }
  )
);

  passport.use(
    "current",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          (req) => req?.cookies?.currentUser || null
        ]),
        secretOrKey: process.env.JWT_SECRET
      },
      (payload, done) => {
        return done(null, payload);
      }
    )
  );
};