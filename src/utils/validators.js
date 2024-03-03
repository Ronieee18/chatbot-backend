import {body,validationResult} from 'express-validator'

export const validate=(validations)=>{
    return async(req,res,next)=>{
        for(let validation of validations){
            const result=await validation.run(req);
            if(!result.isEmpty()){
                break;
            }
        }
        const errors=validationResult(req);
        if(errors.isEmpty()){
            return next();
        }
        return  res.status(422).json({errors:errors.array()});
    }
}

export const loginValidator=[
    body("email").trim().isEmail().withMessage("Email is required"),
    body("password").trim().isLength({min:6}).withMessage("Password must be more than 6 characters")
]

export const signupValidator=[
    body("name").notEmpty().withMessage("Name is required"),
    ...loginValidator,
]

export const chatValidator=[
    body("message").notEmpty().withMessage("Message is required"),
    
]