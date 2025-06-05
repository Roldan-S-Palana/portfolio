import User from '../models//User.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

const login = async (req, res) => {
  try {
    /* code */
    const {email, password} = req.body;
    console.log("Login attempt:", email);
    const user = await User.findOne ({email});
    
    if(!user){
     console.log("User not found");
      return res.status(404).json({success:false, error:"User was not found"});
    }
    
      const isMatch = await bcryptjs.compare(password, user.password);
      
      if(!isMatch){
        console.log("Password incorrect");
        return res.status(401).json({success:false, error:"Password is incorrect"});
      }
      
      const token = jwt.sign(
        {_id: user._id, role: user.role},
      process.env.JWT_KEY, 
      {expiresIn: '10d'}
      );
      console.log("Login Successfully", user.name);
    return res.status(200).json({
      success: true, 
      token, 
      user: {
        _id: user._id, 
        name: user.name, 
        role: user.role
      }
    });
    
  } catch (e) {
    console.log(e);
    return res.status(500).json({success: false, error: 'Server error'});
  }
};

const verify = (res, req) => {
  return req.status(200).json({success: true, user: req.user})
}
export {login, verify};