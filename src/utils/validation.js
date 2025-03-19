import validator from "validator";

export const validateSignupData = (req) => {
    const { firstname , lastname, emailId, password } = req.body;

    if( !firstname || !lastname) {
        throw new Error("Enter all the required Fields.");
    } 
    
    else if(firstname.length > 30) {
        throw new Error("First name should be less than 30 letters.");
    } 
    
    else if(lastname.length > 30) {
        throw new Error("First name should be less than 30 letters.");
    } 
    
    else if(!validator.isEmail(emailId)) {
        throw new Error("Enter a valid email");
    } 
    
    else if(!validator.isStrongPassword(password)) {
        throw new Error("Enter a strong password.");
    }
};

export const validateLoginData = (req) => {
    const { emailId } = req.body;

    if(!validator.isEmail(emailId)) {
        throw new Error("Enter a valid email.");
    }

};