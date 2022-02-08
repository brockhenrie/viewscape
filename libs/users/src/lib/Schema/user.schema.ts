import { environment } from '../../../../../apps/graphql-api/src/environments/environment';
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */
import * as mongoose from 'mongoose';
import * as validator from 'validator';
import * as bcrypt from 'bcrypt';
const SALT_I = 10;
import * as jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.default.isEmail, 'invalid email'],
  },
  passwordHash: {
    type: String,
    required: true,
    minlength: 5,
  },
  phone: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
    default: '',
  },
  apartment: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    default: '',
  },
  state: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
  zip: {
    type: String,
    default: '',
  },
});

userSchema.set('toJSON', {
  virtuals: true,
});
// userSchema.virtual('id').get(function(){
//   return userSchema._id.toHexString();
// });

userSchema.pre('save', function (next) {
  let user = this;

  if (user.isModified('passwordHash')) {
    bcrypt.genSalt(SALT_I, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.passwordHash, salt, function (err, hash) {
        if (err) return next(err);
        user.passwordHash = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods['generateToken'] = async function () {
  let user = this;
  const token = jwt.sign(
    {
      _id: user['id'],
      email: user['email'],
    },
    environment.HashSecret,
    {
      expiresIn: '1d',
    }
  );
  user['token'] = token;
  return user['save']();
};

userSchema.methods['comparePassword'] = function (candidatePassword: string) {
  return bcrypt
    .compare(candidatePassword, this['passwordHash'])
    .then( (result) => {
      // console.log(this['passwordHash'])
      return result;
    });
};

export const User = mongoose.model('User', userSchema);
