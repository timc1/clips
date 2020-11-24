import { compareSync, hashSync } from "bcryptjs";
import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { CASE_INSENSITIVE_COLLATION } from "server/db";
import { generateRandomToken } from "../utils/helpers";
import Notification from "./notification";

const SALT = 10;
const FIVE_MINUTES = 5 * 60000;
const ONE_HOUR = 60 * 60000;
const MAX_LOGIN_ATTEMPTS = 5;
let User;

try {
  if (mongoose.model("User")) {
    User = mongoose.model("User");
  }
} catch (e) {
  if (e.name === "MissingSchemaError") {
    const UserSchema = new mongoose.Schema(
      {
        username: {
          type: String,
          validate: {
            validator: async (username: string) =>
              await User.doesNotExist({ username }),
            message: "Username already exists",
          },
        },
        email: {
          type: String,
          validate: {
            validator: (email: string) => User.doesNotExist({ email }),
            message: "Email already exists",
          },
        },
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        password: {
          type: String,
          required: true,
        },
        comments: {
          type: [String],
        },
        profileImage: {
          type: String,
          default: "",
        },
        invitations: {
          type: [String],
        },
        notifications: {
          type: [String],
        },
        hasOnboarded: {
          type: Boolean,
        },
        emailVerified: {
          type: Boolean,
        },
        authToken: {
          type: String,
        },
        authTokenExpiresAt: {
          type: Date,
        },
        resetPasswordToken: {
          type: String,
        },
        resetPasswordTokenExpiresAt: {
          type: Date,
        },
        loginAttempts: {
          type: Number,
          required: true,
          default: 0,
        },
        lockUntil: {
          type: Date,
        },
      },
      { timestamps: true }
    );

    UserSchema.virtual("isLocked").get(function () {
      return !!(this.lockUntil && this.lockUntil > Date.now());
    });

    UserSchema.pre("save", function () {
      if (this.isModified("password")) {
        // @ts-ignore
        this.password = hashSync(this.password, SALT);
      }
    });

    UserSchema.statics.doesNotExist = async function (field: Object) {
      return (
        (await this.where(field)
          .collation(CASE_INSENSITIVE_COLLATION)
          .countDocuments()) === 0
      );
    };

    UserSchema.methods.comparePasswords = function (password: string) {
      return compareSync(password, this.password);
    };

    UserSchema.methods.compareResetPasswordToken = function (token: string) {
      const expired =
        new Date().getTime() - this.resetPasswordTokenExpiresAt > 0;
      const tokenIsValid = compareSync(token, this.resetPasswordToken);

      if (expired) {
        if (tokenIsValid) {
          return { tokenExpired: true };
        }
        return false;
      }
      return tokenIsValid;
    };

    UserSchema.methods.updateUserPassword = async function (
      newPassword: string
    ) {
      return await User.findByIdAndUpdate(
        this._id,
        {
          $set: { password: hashSync(newPassword, SALT) },
          useFindAndModify: false,
        },
        { new: true }
      );
    };

    UserSchema.methods.generateSignInToken = async function (email: string) {
      const userId = this._id;

      const token = generateRandomToken();
      const hashedToken = hashSync(token, SALT);
      const authTokenExpiresAt = new Date().getTime() + FIVE_MINUTES;
      await User.findByIdAndUpdate(userId, {
        $set: { authToken: hashedToken, authTokenExpiresAt },
        useFindAndModify: false,
      });

      return token;
    };

    UserSchema.methods.generateResetPasswordToken = async function () {
      const userId = this._id;
      const token = generateRandomToken();
      const hashedToken = hashSync(token, SALT);
      const resetPasswordTokenExpiresAt = new Date().getTime() + ONE_HOUR;
      await User.findByIdAndUpdate(userId, {
        $set: {
          resetPasswordToken: hashedToken,
          resetPasswordTokenExpiresAt,
        },
        useFindAndModify: false,
      });

      return token;
    };

    UserSchema.methods.compareSignInToken = function (token: string) {
      const authTokenExpiresAt = this.authTokenExpiresAt;
      const expired = new Date().getTime() - authTokenExpiresAt > 0;
      const tokenIsValid = compareSync(token, this.authToken);

      if (expired) {
        if (tokenIsValid) {
          return { tokenExpired: true };
        }
        return false;
      }
      return tokenIsValid;
    };

    UserSchema.methods.incrementLoginAttempts = async function () {
      // reset when lock has expired
      if (this.lockUntil && this.lockUntil < Date.now()) {
        return await User.findByIdAndUpdate(
          this._id,
          {
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 },
            useFindAndModify: false,
          },
          { new: true }
        );
      }

      // lock the account if reached max attempts and it's not locked already
      if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        return await User.findByIdAndUpdate(
          this._id,
          {
            $set: {
              lockUntil: Date.now() + ONE_HOUR,
              loginAttempts: this.loginAttempts + 1,
            },
            useFindAndModify: false,
          },
          { new: true }
        );
      }

      // else just increment login attempt
      return await User.findByIdAndUpdate(
        this._id,
        {
          $set: { loginAttempts: this.loginAttempts + 1 },
          useFindAndModify: false,
        },
        { new: true }
      );
    };

    UserSchema.methods.resetLoginAttempts = async function () {
      return await User.findByIdAndUpdate(
        this._id,
        {
          $set: { loginAttempts: 0 },
          $unset: { lockUntil: 1 },
          useFindAndModify: false,
        },
        { new: true }
      );
    };

    UserSchema.methods.addInvitation = async function (invitationId: string) {
      return await User.findByIdAndUpdate(
        this._id,
        {
          $addToSet: {
            invitations: invitationId,
          },
        },
        { new: true }
      );
    };

    UserSchema.methods.removeInvitation = async function (
      invitationId: string
    ) {
      return await User.findByIdAndUpdate(
        this._id,
        {
          $pull: {
            invitations: invitationId,
          },
        },
        { new: true }
      );
    };

    UserSchema.methods.getNotifications = async function ({
      page = 1,
      limit = 10,
    }: {
      page: number;
      limit: number;
    }) {
      page = Number(page);
      limit = Number(limit);

      const aggregateQuery = [
        {
          $match: { receiver: this._id },
        },
        {
          $sort: { createdAt: -1 },
        },
      ];

      const aggregate = Notification.aggregate(aggregateQuery);

      const {
        docs,
        totalDocs,
        totalPages,
      } = await Notification.aggregatePaginate(aggregate, {
        page,
        limit,
      });

      return {
        docs,
        totalDocs,
        totalPages,
        page,
        limit,
      };
    };

    UserSchema.methods.updateUser = async function ({
      firstName,
      lastName,
    }: {
      firstName: string;
      lastName: string;
    }) {
      return await User.findByIdAndUpdate(
        this._id,
        {
          $set: { firstName, lastName },
          useFindAndModify: false,
        },
        { new: true }
      );
    };

    UserSchema.plugin(mongooseAggregatePaginate);

    User = mongoose.model("User", UserSchema);
  }
}

export default User;
