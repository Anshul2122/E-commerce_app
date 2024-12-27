import {body, parma, validationResult} from 'express-validator';
import ErrorHandler from './errorHandler.js';

const validateHandler = (req, res, next)=>{
    const errors = validationResult(req);
    const errorMessage = errors.array().map((error)=> error.msg).join(", ");

    if(errors.isEmpty()) return next();
    next(new ErrorHandler(errorMessage, 400));
};
const adminLoginValidator = ()=>[
    body("secret_key", "Enter secret key!").notEmpty(),
]

const registerValidator = ()=>[
    body("name", "Enter Name").notEmpty(),
    body("email", "Enter email").isEmail(),
    body("password", "Enter Password ").isLength({min: 8}).notEmpty(),
    body("avatar", "Avatar is required").notEmpty(),
    body("dob", "enter date of birth").notEmpty(),
    body("gender", "Enter gender").notEmpty(),
]


export {registerValidator} ;