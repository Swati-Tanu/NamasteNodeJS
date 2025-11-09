const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type.`,
      },
    },
  },
  { timestamps: true }
);

//? Compound Indexes
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//? This will be called every time right before save() is called.
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // Check if the fromUserId and toUserId are same
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send connection request to yourself!");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;

//! For craeting index in mongo using mongoose we can either use:
// 1. index: true, or connectionRequestSchema.index({ fromUserId: 1});
// 2. Or if any field is set as unique mongo automatically create index for that field: unique: true
// 3. When we query using two fields we can use Compound index so that both are included.
