import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, email, lastName, role, password, phoneNumber } = req.body;
  if (
    [firstName, lastName, email, role, password, phoneNumber].some(
      (field) => field?.trim() === ""
    )
  ) {
    return res.status(400)
    .json(new ApiError(400, req.body,"","All fields are required"));
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return res.status(409)
    .json(new ApiError(409, req.body,"","User with email already exists",""));
  }
  const user = await User.create({
    firstName,
    lastName,
    email,
    role,
    password,
    phoneNumber,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    return res.status(500)
    .json(new ApiError(500, req.body,"","Something went wrong while registering the user",""));
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if ([email, password].some((field) => field?.trim() === "")) {
    return res.status(400)
    .json(new ApiError(400, req.body,"","Password or email is required"));
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404)
    .json(new ApiError(404, req.body,"","E-mail does not exist"));
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.status(401)
    .json(new ApiError(401, req.body,"","Invalid user credentials"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const check = asyncHandler(async (req, res) => {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, `check: ${req.user._id}`));
  });

export { registerUser, loginUser, logoutUser,check };
