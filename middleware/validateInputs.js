import {body, validationResult} from "express-validator";

const validateProductInput = [
    body("product_name").notEmpty().withMessage("No product name in request"),
    body("product_price").isDecimal().withMessage("Price must be correct data type"),
    body("product_info").optional().isLength({max:255}).withMessage("Product info can be maximum 255 characters"),
    body("product_stock").isInt({gt:0}).withMessage("stock must be a value higher than or equal to 0"),
];

const validateAccountInput = [
    body("email").isEmail().withMessage("Must be a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("firstname").notEmpty().withMessage("First name is required"),
    body("surname").notEmpty().withMessage("Surname is required"),
    body("phone_number").isMobilePhone().withMessage("Must be a valid phone number"),
    body("address").notEmpty().withMessage("Address is required"),
    body("post_number").isPostalCode('any').withMessage("Must be a valid postal code"),
    body("city").notEmpty().withMessage("City is required"),
];

const validateProfileUpdate = [
    body("firstname").optional().notEmpty().withMessage("First name cannot be empty"),
    body("surname").optional().notEmpty().withMessage("Surname cannot be empty"),
    body("phone_number").optional().isMobilePhone().withMessage("Must be a valid phone number"),
    body("address").optional().notEmpty().withMessage("Address cannot be empty"),
    body("post_number").optional().isPostalCode('any').withMessage("Must be a valid postal code"),
    body("city").optional().notEmpty().withMessage("City cannot be empty"),
    body("profile_picture").optional().isURL().withMessage("Profile picture must be a valid URL"),
];

const validatePasswordUpdate = [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters")
        .custom((value, { req }) => {
            if (value === req.body.currentPassword) {
                throw new Error('New password must be different from current password');
            }
            return true;
        }),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Password confirmation does not match new password');
        }
        return true;
    }),
];

const validatePasswordReset = [
    body("email").isEmail().withMessage("Must be a valid email"),
    body("resetToken").notEmpty().withMessage("Reset token is required"),
    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters"),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Password confirmation does not match new password');
        }
        return true;
    }),
];

const accountValidation = (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next();
}

const productValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};


export default {
    validateAccountInput, 
    validateProductInput, 
    validateProfileUpdate,
    validatePasswordUpdate,
    validatePasswordReset,
    accountValidation, 
    productValidation
};