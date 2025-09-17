import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import config from "../config/index.js";
import { User } from "../models/User.js";

passport.serializeUser((user: any, done: VerifyCallback) => done(null, user._id));
passport.deserializeUser(async (id: string, done: VerifyCallback) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: config.googleClientId,
            clientSecret: config.googleClientSecret,
            callbackURL: config.googleCallbackUrl,
        },
        async (_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) return done(new Error("No email from Google"));

                let user = await User.findOne({ email });
                if (!user) {
                    user = await User.create({
                        name: profile.displayName || email.split("@")[0],
                        email,
                        googleId: profile.id,
                    });
                } else if (!user.googleId) {
                    user.googleId = profile.id;
                    await user.save();
                }
                done(null, user);
            } catch (err) {
                done(err as any);
            }
        }

    )
);

export default passport;
