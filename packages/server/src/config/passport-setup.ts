import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { Employee } from "@models";
import { EmployeeDocument } from "@@types/models";

passport.serializeUser((employee, done) => {
  // @ts-ignore
  done(null, employee._id);
});

passport.deserializeUser(async (id, done) => {
  const employee = await Employee.findById(id);
  done(null, employee);
});

passport.use(
  new GoogleStrategy.Strategy(
    {
      // options for Google Strategy
      callbackURL: "/auth/google/redirect",
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    async (_1 /* accessToken */, _2 /* refreshToken */, profile, done) => {
      // Check if user exists
      const employee = await Employee.findOne({ email: profile._json.email });
      if (employee) {
        employee.lastLogin = new Date(Date.now());
        employee.image = profile._json.picture;
        if (!employee.googleId) employee.googleId = profile._json.sub;
        await employee.save({ validateBeforeSave: false });
      }
      done(null, employee as EmployeeDocument | undefined);
    }
  )
);
