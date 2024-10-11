import { Schema } from "mongoose";

export const modelTransform = (schema: Schema) => {
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (_, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  });

  schema.set("toObject", {
    virtuals: true,
    versionKey: false,
    transform: function (_, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  });
};
